import { NextResponse } from "next/server"
import { supabaseAdmin } from "../../../../lib/supabase/admin"

export async function POST(request) {
  try {
    const { reference } = await request.json()

    if (!reference) {
      return NextResponse.json({ status: "failed", message: "No transaction reference provided." }, { status: 400 })
    }

    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY

    if (!paystackSecretKey) {
      console.error("PAYSTACK_SECRET_KEY is not set")
      return NextResponse.json({ status: "failed", message: "Server configuration error." }, { status: 500 })
    }

    // Verify transaction with Paystack
    const paystackResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
      },
    })

    const paystackData = await paystackResponse.json()

    if (!paystackResponse.ok || !paystackData.status || paystackData.data.status !== "success") {
      console.error("Paystack verification failed:", paystackData)
      return NextResponse.json(
        { status: "failed", message: paystackData.message || "Payment verification failed with Paystack." },
        { status: 400 },
      )
    }

    const transaction = paystackData.data
    const metadata = transaction.metadata

    // Check if order already exists to prevent duplicate entries
    const { data: existingOrder, error: existingOrderError } = await supabaseAdmin
      .from("orders")
      .select("id")
      .eq("paystack_reference", reference)
      .single()

    if (existingOrderError && existingOrderError.code !== "PGRST116") {
      // PGRST116 means no rows found
      console.error("Error checking for existing order:", existingOrderError)
      return NextResponse.json({ status: "failed", message: "Database error during order check." }, { status: 500 })
    }

    if (existingOrder) {
      console.warn(`Order with reference ${reference} already exists. Skipping insertion.`)
      return NextResponse.json({
        status: "success",
        message: "Order already processed.",
        orderReference: existingOrder.id,
      })
    }

    // Save order to Supabase
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        customer_email: metadata.customerEmail,
        total_amount: transaction.amount / 100, // Convert kobo back to Naira
        subtotal: metadata.subtotal,
        delivery_fee: metadata.deliveryFee,
        discount_amount: metadata.discountAmount,
        promo_code: metadata.promoCode,
        delivery_city: metadata.deliveryCity,
        paystack_reference: reference,
        paystack_status: transaction.status,
        order_status: "pending", // Initial status
      })
      .select()
      .single()

    if (orderError) {
      console.error("Error saving order to Supabase:", orderError)
      return NextResponse.json({ status: "failed", message: "Failed to save order details." }, { status: 500 })
    }

    // Save order items
    const orderItemsToInsert = metadata.cartItems.map((item) => ({
      order_id: order.id,
      product_id: item.id,
      product_name: item.name,
      product_price: item.price,
      quantity: item.quantity,
      bottle_size: item.bottle_size,
    }))

    const { error: orderItemsError } = await supabaseAdmin.from("order_items").insert(orderItemsToInsert)

    if (orderItemsError) {
      console.error("Error saving order items to Supabase:", orderItemsError)
      // Consider rolling back the order if items fail, or handle partial success
      return NextResponse.json({ status: "failed", message: "Failed to save order items." }, { status: 500 })
    }

    return NextResponse.json({
      status: "success",
      message: "Payment verified and order saved!",
      orderReference: order.id,
    })
  } catch (error) {
    console.error("Error in Paystack verify API:", error)
    return NextResponse.json(
      { status: "failed", message: "Internal server error during verification." },
      { status: 500 },
    )
  }
}
