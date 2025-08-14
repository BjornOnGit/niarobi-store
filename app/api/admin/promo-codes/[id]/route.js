import { NextResponse } from "next/server"
import { supabaseAdmin } from "../../../../../lib/supabase/admin"

// GET - Fetch single promo code
export async function GET(request, { params }) {
  try {
    const { data: promoCode, error } = await supabaseAdmin.from("promo_codes").select("*").eq("id", params.id).single()

    if (error || !promoCode) {
      return NextResponse.json({ error: "Promo code not found" }, { status: 404 })
    }

    return NextResponse.json({ promoCode })
  } catch (error) {
    console.error("Error fetching promo code:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT - Update promo code
export async function PUT(request, { params }) {
  try {
    const promoData = await request.json()

    // Validate required fields
    if (!promoData.code || !promoData.discount_value || promoData.min_order_amount === undefined) {
      return NextResponse.json(
        { error: "Code, discount value, and minimum order amount are required" },
        { status: 400 },
      )
    }

    // Ensure code is uppercase
    promoData.code = promoData.code.toUpperCase()

    // Check if code already exists (excluding current promo code)
    const { data: existingPromo } = await supabaseAdmin
      .from("promo_codes")
      .select("id")
      .eq("code", promoData.code)
      .neq("id", params.id)
      .single()

    if (existingPromo) {
      return NextResponse.json({ error: "Promo code already exists" }, { status: 400 })
    }

    const { data: promoCode, error } = await supabaseAdmin
      .from("promo_codes")
      .update(promoData)
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      console.error("Error updating promo code:", error)
      return NextResponse.json({ error: "Failed to update promo code" }, { status: 500 })
    }

    return NextResponse.json({ promoCode })
  } catch (error) {
    console.error("Error in update promo code API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PATCH - Partial update (e.g., active status)
export async function PATCH(request, { params }) {
  try {
    const updates = await request.json()

    const { data: promoCode, error } = await supabaseAdmin
      .from("promo_codes")
      .update(updates)
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      console.error("Error updating promo code:", error)
      return NextResponse.json({ error: "Failed to update promo code" }, { status: 500 })
    }

    return NextResponse.json({ promoCode })
  } catch (error) {
    console.error("Error in patch promo code API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE - Delete promo code
export async function DELETE(request, { params }) {
  try {
    const { error } = await supabaseAdmin.from("promo_codes").delete().eq("id", params.id)

    if (error) {
      console.error("Error deleting promo code:", error)
      return NextResponse.json({ error: "Failed to delete promo code" }, { status: 500 })
    }

    return NextResponse.json({ message: "Promo code deleted successfully" })
  } catch (error) {
    console.error("Error in delete promo code API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
