import { supabaseAdmin } from "./supabase/admin"

export async function isUserAdmin(userId) {
  if (!userId) return false

  try {
    const { data, error } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .single()

    if (error && error.code !== "PGRST116") {
      console.error("Error checking admin status:", error)
      return false
    }

    return !!data
  } catch (error) {
    console.error("Error checking admin status:", error)
    return false
  }
}

export async function makeUserAdmin(userId) {
  try {
    const { data, error } = await supabaseAdmin.from("user_roles").upsert({ user_id: userId, role: "admin" }).select()

    if (error) {
      console.error("Error making user admin:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error making user admin:", error)
    return false
  }
}
