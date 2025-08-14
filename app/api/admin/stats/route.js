import { NextResponse } from "next/server"
import { supabaseAdmin } from "../../../../lib/supabase/admin"

export async function GET(request) {
  try {
    // Get user from request headers (you might need to implement proper auth middleware)
    const authHeader = request.headers.get("authorization")
    // For now, we'll skip auth check in this demo, but in production you'd verify the user

    // In a real implementation, you'd extract and verify the user token here
    // const userId = await verifyAuthToken(authHeader)
    // const adminCheck = await isUserAdmin(userId)
    // if (!adminCheck) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    // }

    // Fetch total products
    const { count: totalProducts } = await supabaseAdmin.from("products").select("*", { count: "exact", head: true })

    // Fetch total orders
    const { count: totalOrders } = await supabaseAdmin.from("orders").select("*", { count: "exact", head: true })

    // Fetch total revenue
    const { data: revenueData } = await supabaseAdmin
      .from("orders")
      .select("total_amount")
      .eq("paystack_status", "success")

    const totalRevenue = revenueData?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0

    // Fetch pending orders
    const { count: pendingOrders } = await supabaseAdmin
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("order_status", "pending")

    return NextResponse.json({
      totalProducts: totalProducts || 0,
      totalOrders: totalOrders || 0,
      totalRevenue,
      pendingOrders: pendingOrders || 0,
    })
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
