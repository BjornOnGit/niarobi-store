import { NextResponse } from "next/server"
import { supabaseAdmin } from "../../../../lib/supabase/admin"

export async function GET() {
  try {
    // Get all users from auth.users
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers()

    if (authError) {
      console.error("Error fetching auth users:", authError)
      return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
    }

    // Get user roles
    const { data: userRoles, error: rolesError } = await supabaseAdmin.from("user_roles").select("user_id, role")

    if (rolesError) {
      console.error("Error fetching user roles:", rolesError)
      return NextResponse.json({ error: "Failed to fetch user roles" }, { status: 500 })
    }

    // Combine auth users with their roles
    const users = authUsers.users.map((user) => {
      const userRole = userRoles?.find((role) => role.user_id === user.id)
      return {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        role: userRole?.role || null,
      }
    })

    return NextResponse.json({ users })
  } catch (error) {
    console.error("Error in admin users API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const { email, password, role } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    if (!["user", "admin"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
    })

    if (authError) {
      console.error("Error creating user:", authError)
      return NextResponse.json({ error: authError.message || "Failed to create user" }, { status: 400 })
    }

    // If role is admin, add to user_roles table
    if (role === "admin") {
      const { error: roleError } = await supabaseAdmin
        .from("user_roles")
        .insert({ user_id: authData.user.id, role: "admin" })

      if (roleError) {
        console.error("Error setting admin role:", roleError)
        // Don't fail the entire operation, just log the error
      }
    }

    return NextResponse.json({
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        role: role,
      },
    })
  } catch (error) {
    console.error("Error in create user API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
