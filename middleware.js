import { createServerClient } from "@supabase/ssr"
import { NextResponse } from "next/server"

export async function middleware(request) {
  // Only apply middleware to admin routes
  if (!request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next()
  }

  // Skip middleware for admin login page
  if (request.nextUrl.pathname === "/admin/login") {
    return NextResponse.next()
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      get(name) {
        return request.cookies.get(name)?.value
      },
      set(name, value, options) {
        request.cookies.set({
          name,
          value,
          ...options,
        })
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        })
        response.cookies.set({
          name,
          value,
          ...options,
        })
      },
      remove(name, options) {
        request.cookies.set({
          name,
          value: "",
          ...options,
        })
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        })
        response.cookies.set({
          name,
          value: "",
          ...options,
        })
      },
    },
  })

  try {
    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // If no user, redirect to auth page
    if (!user) {
      return NextResponse.redirect(new URL("/auth", request.url))
    }

    // Check if user is admin
    const { data: userRole } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .single()

    // If not admin, redirect to products page
    if (!userRole) {
      return NextResponse.redirect(new URL("/products", request.url))
    }

    return response
  } catch (error) {
    console.error("Middleware error:", error)
    return NextResponse.redirect(new URL("/auth", request.url))
  }
}

export const config = {
  matcher: ["/admin/:path*"],
}
