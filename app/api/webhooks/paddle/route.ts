import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { EventName } from "@paddle/paddle-node-sdk";
import { getPaddleServerClient } from "@/lib/paddle";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// Paddle's Node SDK relies on Node crypto to verify webhook signatures.
export const runtime = "nodejs";

type ProfileUpdate = {
  subscription_status: string;
  paddle_customer_id?: string;
  paddle_subscription_id?: string;
};

/**
 * Updates the matching profile row. Webhooks run outside a user session, so a
 * service-role client is preferred (bypasses RLS). When the service key is not
 * configured we fall back to the standard server client.
 */
async function markSubscriptionActive(
  email: string,
  update: ProfileUpdate,
): Promise<{ matched: boolean; error: string | null }> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (url && serviceRoleKey) {
    const admin = createClient(url, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await admin
      .from("profiles")
      .update(update)
      .eq("email", email)
      .select("id");
    if (error) return { matched: false, error: error.message };
    return { matched: (data ?? []).length > 0, error: null };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("profiles")
    .update(update)
    .eq("email", email)
    .select("id");
  if (error) return { matched: false, error: error.message };
  return { matched: (data ?? []).length > 0, error: null };
}

export async function POST(request: Request) {
  const secret = process.env.PADDLE_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[paddle webhook] PADDLE_WEBHOOK_SECRET is not configured");
    return NextResponse.json({ error: "Webhook not configured." }, { status: 500 });
  }

  const signature = request.headers.get("paddle-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing paddle-signature header." }, { status: 401 });
  }

  const body = await request.text();

  const paddle = await getPaddleServerClient();

  let event;
  try {
    event = await paddle.webhooks.unmarshal(body, secret, signature);
  } catch (error) {
    console.error("[paddle webhook] signature verification failed", error);
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }

  try {
    let email: string | null = null;
    let customerId: string | null = null;
    let subscriptionId: string | null = null;

    if (event.eventType === EventName.TransactionCompleted) {
      customerId = event.data.customerId;
      subscriptionId = event.data.subscriptionId;
    } else if (event.eventType === EventName.SubscriptionCreated) {
      customerId = event.data.customerId;
      subscriptionId = event.data.id;
    } else {
      // Acknowledge events we do not act on so Paddle stops retrying.
      return NextResponse.json({ received: true, handled: false });
    }

    if (customerId) {
      const customer = await paddle.customers.get(customerId);
      email = customer.email;
    }

    if (!email) {
      console.error("[paddle webhook] event had no resolvable customer email", event.eventType);
      return NextResponse.json({ error: "No customer email on event." }, { status: 422 });
    }

    const update: ProfileUpdate = { subscription_status: "active" };
    if (customerId) update.paddle_customer_id = customerId;
    if (subscriptionId) update.paddle_subscription_id = subscriptionId;

    const { matched, error } = await markSubscriptionActive(email, update);
    if (error) {
      console.error("[paddle webhook] profile update failed", error);
      return NextResponse.json({ error: "Could not update profile." }, { status: 500 });
    }
    if (!matched) {
      console.error("[paddle webhook] no profile found for email", email);
      return NextResponse.json({ error: "No matching profile." }, { status: 404 });
    }

    return NextResponse.json({ received: true, handled: true });
  } catch (error) {
    console.error("[paddle webhook] handler error", error);
    return NextResponse.json({ error: "Webhook handler failed." }, { status: 500 });
  }
}
