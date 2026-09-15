import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  
  // Default redirect is dashboard, but allow 'next' parameter to override
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // Success! Redirect to dashboard
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // If it fails, redirect to login with an error
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}