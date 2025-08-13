import { supabaseAdmin } from "./supabase/admin" // Use the admin client for server-side fetching

export async function getOrderDetails(orderReference) {
  if (!orderReference) {
    return null
  }

  try {
    // Fetch the main order details
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("paystack_reference", orderReference)
      .single()

    if (orderError || !order) {
      console.error("Error fetching order:", orderError)
      return null
    }

    // Fetch the items associated with this order
    const { data: orderItems, error: itemsError } = await supabaseAdmin
      .from("order_items")
      .select("*")
      .eq("order_id", order.id)

    if (itemsError) {
      console.error("Error fetching order items:", itemsError)
      // Still return the order even if items fail to load
      return { ...order, items: [] }
    }

    return { ...order, items: orderItems || [] }
  } catch (error) {
    console.error("Unexpected error in getOrderDetails:", error)
    return null
  }
}
