import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Webhook } from "standardwebhooks";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

async function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (url && serviceRoleKey) {
    return createClient(url, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return createSupabaseServerClient();
}

export async function POST(request: Request) {
  // Raw bytes are required for signature verification — never parse first.
  const rawBody = await request.text();

  const webhookKey = process.env.DODO_PAYMENTS_WEBHOOK_KEY;
  if (webhookKey) {
    try {
      await new Webhook(webhookKey).verify(rawBody, {
        "webhook-id": request.headers.get("webhook-id") ?? "",
        "webhook-signature": request.headers.get("webhook-signature") ?? "",
        "webhook-timestamp": request.headers.get("webhook-timestamp") ?? "",
      });
    } catch {
      console.error("[dodo webhook] signature verification failed");
      return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
    }
  } else {
    console.error(
      "[dodo webhook] DODO_PAYMENTS_WEBHOOK_KEY is not configured; accepting unsigned payload. " +
        "Add the signing secret from Dodo Dashboard → Developer → Webhooks.",
    );
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(rawBody) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  try {
    const eventType = typeof payload.type === "string" ? payload.type : "";
    const data = (payload.data ?? {}) as Record<string, unknown>;
    const customer = (data.customer ?? {}) as Record<string, unknown>;
    const email =
      typeof customer.email === "string"
        ? customer.email
        : typeof data.customer_email === "string"
          ? data.customer_email
          : null;
    const subscriptionId =
      typeof data.subscription_id === "string"
        ? data.subscription_id
        : typeof data.id === "string" && eventType.startsWith("subscription")
          ? data.id
          : null;
    const customerId =
      typeof data.customer_id === "string"
        ? data.customer_id
        : typeof customer.customer_id === "string"
          ? customer.customer_id
          : null;

    const supabase = await getClient();

    // Dodo event names: subscription.active (new/renewed subscription),
    // payment.succeeded (one-time or subscription payment), subscription.renewed.
    const ACTIVATING_EVENTS = ["subscription.active", "subscription.renewed", "payment.succeeded"];

    if (ACTIVATING_EVENTS.includes(eventType)) {
      if (!email) {
        console.error("[dodo webhook] event had no customer email", eventType);
        return NextResponse.json({ received: true, handled: false });
      }
      const fullUpdate: Record<string, string> = { subscription_status: "active" };
      if (subscriptionId) fullUpdate.dodo_subscription_id = subscriptionId;
      if (customerId) fullUpdate.dodo_customer_id = customerId;

      const firstAttempt = await supabase
        .from("profiles")
        .update(fullUpdate)
        .eq("email", email)
        .select("id");
      let error = firstAttempt.error;
      let matched = (firstAttempt.data ?? []).length > 0;

      // The billing-columns migration may not have been applied yet. Retry
      // with just the status so the payment is never lost to a missing column.
      if (error?.code === "PGRST204") {
        console.error(
          "[dodo webhook] billing columns missing, retrying with status only. " +
            "Run supabase/migrations/20261006010000_profiles_dodo_columns.sql",
          error.message,
        );
        const retry = await supabase
          .from("profiles")
          .update({ subscription_status: "active" })
          .eq("email", email)
          .select("id");
        error = retry.error;
        matched = (retry.data ?? []).length > 0;
      }

      if (error) {
        console.error("[dodo webhook] profile update failed", error);
        return NextResponse.json({ error: "Could not update profile." }, { status: 500 });
      }
      if (!matched) {
        console.error("[dodo webhook] no profile found for customer email", email);
        return NextResponse.json({ error: "No matching profile." }, { status: 404 });
      }
      return NextResponse.json({ received: true, handled: true });
    }

    if (eventType === "subscription.cancelled" || eventType === "subscription.expired") {
      if (!subscriptionId) {
        console.error("[dodo webhook] canceled event had no subscription id");
        return NextResponse.json({ received: true, handled: false });
      }
      const { error } = await supabase
        .from("profiles")
        .update({ subscription_status: "canceled" })
        .eq("dodo_subscription_id", subscriptionId);
      if (error) {
        console.error("[dodo webhook] cancel update failed", error);
        return NextResponse.json({ error: "Could not update profile." }, { status: 500 });
      }
      return NextResponse.json({ received: true, handled: true });
    }

    console.error("[dodo webhook] unhandled event type", eventType);
    return NextResponse.json({ received: true, handled: false });
  } catch (error) {
    console.error("[dodo webhook] handler error", error);
    return NextResponse.json({ error: "Webhook handler failed." }, { status: 500 });
  }
}
