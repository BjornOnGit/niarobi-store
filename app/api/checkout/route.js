import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const { cartItems, customerEmail, deliveryCity, promoCodeData, deliveryFee } = await request.json()

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
    }
    if (!customerEmail) {
      return NextResponse.json({ error: "Customer email is required" }, { status: 400 })
    }
    if (!deliveryCity) {
      return NextResponse.json({ error: "Delivery city is required" }, { status: 400 })
    }
    if (deliveryFee === undefined || deliveryFee === null) {
      return NextResponse.json({ error: "Delivery fee is required" }, { status: 400 })
    }

    // Calculate total amount
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    let totalAmount = subtotal + deliveryFee

    let discountAmount = 0
    if (promoCodeData && promoCodeData.discountAmount) {
      discountAmount = promoCodeData.discountAmount
      totalAmount -= discountAmount
    }

    // Ensure total amount is not negative
    totalAmount = Math.max(0, totalAmount)

    // Paystack requires amount in kobo (cents)
    const amountInKobo = Math.round(totalAmount * 100)

    if (amountInKobo <= 0) {
      return NextResponse.json({ error: "Total amount must be greater than zero" }, { status: 400 })
    }

    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY

    if (!paystackSecretKey) {
      console.error("PAYSTACK_SECRET_KEY is not set")
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    // Initialize Paystack transaction
    const paystackResponse = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: customerEmail,
        amount: amountInKobo,
        callback_url: `${process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000"}/thank-you`, // Redirect after payment
        metadata: {
          cartItems: cartItems.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            bottle_size: item.bottle_size,
          })),
          customerEmail,
          deliveryCity,
          subtotal,
          deliveryFee,
          discountAmount,
          promoCode: promoCodeData ? promoCodeData.code : null,
        },
      }),
    })

    const paystackData = await paystackResponse.json()

    if (!paystackResponse.ok || !paystackData.status) {
      console.error("Paystack initialization error:", paystackData)
      return NextResponse.json({ error: paystackData.message || "Failed to initialize payment" }, { status: 500 })
    }

    // Optionally, save a pending order to Supabase here if needed for tracking
    // For now, we'll save the order only after successful payment on /thank-you page

    return NextResponse.json({ authorization_url: paystackData.data.authorization_url })
  } catch (error) {
    console.error("Error in checkout API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
