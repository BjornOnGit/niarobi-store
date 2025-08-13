import { supabaseAdmin } from "../../../../lib/supabase/admin" // Import from the new server-side file
import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const { code, orderAmount } = await request.json()

    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "Promo code is required" }, { status: 400 })
    }

    if (!orderAmount || typeof orderAmount !== "number" || orderAmount <= 0) {
      return NextResponse.json({ error: "Valid order amount is required" }, { status: 400 })
    }

    // Fetch promo code from database
    const { data: promoCode, error } = await supabaseAdmin // Use supabaseAdmin here
      .from("promo_codes")
      .select("*")
      .eq("code", code.toUpperCase())
      .eq("is_active", true)
      .single()

    if (error || !promoCode) {
      console.error("Supabase error fetching promo code:", error)
      return NextResponse.json({ error: "Invalid promo code" }, { status: 404 })
    }

    // Check if promo code is still valid (date range)
    const now = new Date()
    const validFrom = new Date(promoCode.valid_from)
    const validUntil = promoCode.valid_until ? new Date(promoCode.valid_until) : null

    if (now < validFrom) {
      return NextResponse.json({ error: "Promo code is not yet active" }, { status: 400 })
    }

    if (validUntil && now > validUntil) {
      return NextResponse.json({ error: "Promo code has expired" }, { status: 400 })
    }

    // Check usage limit
    if (promoCode.usage_limit && promoCode.used_count >= promoCode.usage_limit) {
      return NextResponse.json({ error: "Promo code usage limit exceeded" }, { status: 400 })
    }

    // Check minimum order amount
    if (orderAmount < promoCode.min_order_amount) {
      return NextResponse.json(
        {
          error: `Minimum order amount of ₦${promoCode.min_order_amount.toLocaleString()} required for this promo code`,
        },
        { status: 400 },
      )
    }

    // Calculate discount
    let discountAmount = 0

    if (promoCode.discount_type === "percentage") {
      discountAmount = (orderAmount * promoCode.discount_value) / 100

      // Apply maximum discount limit if specified
      if (promoCode.max_discount_amount && discountAmount > promoCode.max_discount_amount) {
        discountAmount = promoCode.max_discount_amount
      }
    } else if (promoCode.discount_type === "fixed") {
      discountAmount = promoCode.discount_value

      // Don't allow discount to exceed order amount
      if (discountAmount > orderAmount) {
        discountAmount = orderAmount
      }
    }

    // Round to nearest naira
    discountAmount = Math.round(discountAmount)

    return NextResponse.json({
      valid: true,
      code: promoCode.code,
      discountType: promoCode.discount_type,
      discountValue: promoCode.discount_value,
      discountAmount,
      message: `Promo code applied! You saved ₦${discountAmount.toLocaleString()}`,
    })
  } catch (error) {
    console.error("Error validating promo code (catch block):", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// GET method to fetch available promo codes (optional)
export async function GET() {
  try {
    const { data: promoCodes, error } = await supabaseAdmin // Use supabaseAdmin here
      .from("promo_codes")
      .select("code, discount_type, discount_value, min_order_amount, valid_until")
      .eq("is_active", true)
      .gte("valid_until", new Date().toISOString())
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching promo codes:", error)
      return NextResponse.json({ error: "Failed to fetch promo codes" }, { status: 500 })
    }

    return NextResponse.json({ promoCodes: promoCodes || [] })
  } catch (error) {
    console.error("Error fetching promo codes:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
