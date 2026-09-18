import { createBrowserClient } from '@supabase/ssr'

export function createSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,      // Keeps the user logged in across browser sessions
        autoRefreshToken: true,    // Automatically refreshes the token before it expires
      }
    }
  )
}