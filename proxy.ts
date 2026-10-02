import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from '@supabase/ssr';

// MUST BE NAMED 'proxy' WHEN THE FILE IS proxy.ts
export async function proxy(request: NextRequest) {
  const response = NextResponse.next({ request });
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Marketing-domain routing should still work if Supabase is not configured
  // locally. Authenticated dashboard pages will report the missing env var.
  if (!supabaseUrl || !supabaseKey) return response;

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Refresh the session and verify the JWT. getClaims() validates the access
  // token's signature and expiry locally (with asymmetric keys) instead of
  // calling the Auth server on every request, so it stays fast. When the token
  // is stale, createServerClient rotates the cookies via setAll() above.
  const { data: claimsData } = await supabase.auth.getClaims();
  const claims = claimsData?.claims;

  const { pathname, hostname } = request.nextUrl;

  // Skip static files and Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/auth/callback")
  ) {
    return response;
  }

  const APP_HOST = "app.yogawritecode.com";
  const MARKETING_HOSTS = ["yogawritecode.com", "www.yogawritecode.com"];

  // App subdomain: redirect root to dashboard
  if (hostname === APP_HOST && pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // Marketing domains: send auth/dashboard routes to the app subdomain
  if (MARKETING_HOSTS.includes(hostname)) {
    if (pathname === "/login" || pathname === "/signup" || pathname.startsWith("/dashboard")) {
      const url = request.nextUrl.clone();
      url.hostname = APP_HOST;
      return NextResponse.redirect(url);
    }
  }

  // Optimistic auth guard: the JWT is already verified above, so this only
  // reads the token — no database call. Unauthenticated users are sent to
  // /login. This is a UX pre-filter; the dashboard layout still verifies the
  // user server-side before rendering any data.
  if (pathname.startsWith("/dashboard") && !claims?.sub) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.search = "";

    const redirectResponse = NextResponse.redirect(loginUrl);
    // Preserve any refreshed session cookies from the Supabase client.
    response.cookies.getAll().forEach((cookie) => redirectResponse.cookies.set(cookie));
    return redirectResponse;
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico)).*)",
  ],
};