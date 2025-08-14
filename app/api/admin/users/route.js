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
