// This client is used for data fetching in Server Components and Server Actions
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables for server client.",
  )
}

// Create a Supabase client instance for server-side data fetching
// This client uses the public anon key, but is initialized on the server.
export const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
  cookies: {
    get(name) {
      return cookies().get(name)?.value
    },
    set(name, value, options) {
      cookies().set(name, value, options)
    },
    remove(name, options) {
      cookies().set(name, "", options)
    },
  },
})
