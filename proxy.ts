import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from '@supabase/ssr';

// MUST BE NAMED 'proxy' WHEN THE FILE IS proxy.ts
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

  // Refresh the session to keep the user logged in
  await supabase.auth.getUser();

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

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico)).*)",
  ],
};