import { NextResponse } from "next/server"
import { supabaseAdmin } from "../../../../lib/supabase/admin"

// GET - Fetch all promo codes for admin
export async function GET() {
  try {
    const { data: promoCodes, error } = await supabaseAdmin
      .from("promo_codes")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching promo codes:", error)
      return NextResponse.json({ error: "Failed to fetch promo codes" }, { status: 500 })
    }

    return NextResponse.json({ promoCodes: promoCodes || [] })
  } catch (error) {
    console.error("Error in admin promo codes API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Create new promo code
export async function POST(request) {
  try {
    const promoData = await request.json()

    // Validate required fields
    if (!promoData.code || !promoData.discount_value || promoData.min_order_amount === undefined) {
      return NextResponse.json(
        { error: "Code, discount value, and minimum order amount are required" },
        { status: 400 },
      )
    }

    // Check if code already exists
    const { data: existingPromo } = await supabaseAdmin
      .from("promo_codes")
      .select("id")
      .eq("code", promoData.code.toUpperCase())
      .single()

    if (existingPromo) {
      return NextResponse.json({ error: "Promo code already exists" }, { status: 400 })
    }

    // Ensure code is uppercase
    promoData.code = promoData.code.toUpperCase()

    const { data: promoCode, error } = await supabaseAdmin.from("promo_codes").insert(promoData).select().single()

    if (error) {
      console.error("Error creating promo code:", error)
      return NextResponse.json({ error: "Failed to create promo code" }, { status: 500 })
    }

    return NextResponse.json({ promoCode }, { status: 201 })
  } catch (error) {
    console.error("Error in create promo code API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
