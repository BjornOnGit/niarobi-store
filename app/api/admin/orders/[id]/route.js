import { NextResponse } from "next/server"
import { supabaseAdmin } from "../../../../../lib/supabase/admin"

// GET - Fetch single order with items
export async function GET(request, { params }) {
  try {
    const { data: order, error } = await supabaseAdmin
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
      .eq("id", params.id)
      .single()

    if (error || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Transform the data to include items array
    const transformedOrder = {
      ...order,
      items: order.order_items || [],
    }

    return NextResponse.json({ order: transformedOrder })
  } catch (error) {
    console.error("Error fetching order:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PATCH - Update order status
export async function PATCH(request, { params }) {
  try {
    const updates = await request.json()

    // Validate order status if provided
    if (updates.order_status) {
      const validStatuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"]
      if (!validStatuses.includes(updates.order_status)) {
        return NextResponse.json({ error: "Invalid order status" }, { status: 400 })
      }
    }

    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .update(updates)
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      console.error("Error updating order:", error)
      return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error("Error in update order API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
