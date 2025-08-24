import { NextResponse } from "next/server"
import { supabaseAdmin } from "../../../../../../lib/supabase/admin"

export async function POST(request, { params }) {
  try {
    const { id } = params

    // Remove admin role from user_roles table
    const { error } = await supabaseAdmin.from("user_roles").delete().eq("user_id", id).eq("role", "admin")

    if (error) {
      console.error("Error removing admin role:", error)
      return NextResponse.json({ error: "Failed to remove admin role" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in remove admin API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
