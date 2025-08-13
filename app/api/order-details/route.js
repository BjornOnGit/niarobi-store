import { NextResponse } from "next/server"
import { getOrderDetails } from "../../../lib/orders" // This uses supabaseAdmin

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const reference = searchParams.get("reference")

    if (!reference) {
      return NextResponse.json({ error: "Order reference is required" }, { status: 400 })
    }

    const order = await getOrderDetails(reference)

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error("Error in order-details API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
