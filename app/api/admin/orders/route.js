import { NextResponse } from "next/server"
import { supabaseAdmin } from "../../../../lib/supabase/admin"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    let query = supabaseAdmin
      .from("orders")
      .select(`
        *,
        order_items (
          id,
          product_name,
          product_price,
          quantity,
          bottle_size
        )
      `)
      .order("created_at", { ascending: false })

    // Filter by status if provided
    if (status && status !== "all") {
      query = query.eq("order_status", status)
    }

    const { data: orders, error } = await query

    if (error) {
      console.error("Error fetching orders:", error)
      return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
    }

    // Transform the data to include items array
    const transformedOrders =
      orders?.map((order) => ({
        ...order,
        items: order.order_items || [],
      })) || []

    return NextResponse.json({ orders: transformedOrders })
  } catch (error) {
    console.error("Error in admin orders API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
