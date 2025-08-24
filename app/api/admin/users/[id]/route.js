import { NextResponse } from "next/server"
import { supabaseAdmin } from "../../../../../lib/supabase/admin"

export async function DELETE(request, { params }) {
  try {
    const { id } = params

    // First, remove any user roles
    await supabaseAdmin.from("user_roles").delete().eq("user_id", id)

    // Delete user from Supabase Auth
    const { error } = await supabaseAdmin.auth.admin.deleteUser(id)

    if (error) {
      console.error("Error deleting user:", error)
      return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in delete user API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
