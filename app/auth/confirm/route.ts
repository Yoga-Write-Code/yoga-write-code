import { NextResponse } from "next/server";
import { sendWelcomeEmail } from "@/lib/email/resend";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Landing route for the address-confirmation link Supabase emails.
 *
 * @supabase/ssr uses the PKCE flow, so the link arrives with a `code` query
 * param that has to be exchanged for a session before the cookies are set. This
 * mirrors /auth/callback, but also sends the welcome email, because by this
 * point the address is confirmed and the account is genuinely usable.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("[auth/confirm] code exchange failed:", error.message);
    return NextResponse.redirect(`${origin}/login?error=verification_failed`);
  }

  const { data } = await supabase.auth.getUser();
  const email = data.user?.email;

  if (email) {
    // Guard against a duplicate send if the link is clicked twice in one browser.
    const alreadyWelcomed = request.headers
      .get("cookie")
      ?.split(";")
      .some((part) => part.trim().startsWith("ywc_welcomed="));

    if (!alreadyWelcomed) {
      await sendWelcomeEmail(email);

      const response = NextResponse.redirect(`${origin}${next}`);
      response.cookies.set("ywc_welcomed", "1", {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24,
      });
      return response;
    }
  }

  return NextResponse.redirect(`${origin}${next}`);
}
