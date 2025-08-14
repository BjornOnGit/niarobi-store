import { NextResponse } from "next/server"
import { supabaseAdmin } from "../../../../../lib/supabase/admin"

// GET - Fetch single product
export async function GET(request, { params }) {
  try {
    const { data: product, error } = await supabaseAdmin.from("products").select("*").eq("id", params.id).single()

    if (error || !product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ product })
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT - Update product
export async function PUT(request, { params }) {
  try {
    const productData = await request.json()

    // Validate required fields
    if (!productData.name || !productData.price || !productData.category) {
      return NextResponse.json({ error: "Name, price, and category are required" }, { status: 400 })
    }

    const { data: product, error } = await supabaseAdmin
      .from("products")
      .update(productData)
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      console.error("Error updating product:", error)
      return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
    }

    return NextResponse.json({ product })
  } catch (error) {
    console.error("Error in update product API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PATCH - Partial update (e.g., stock status)
export async function PATCH(request, { params }) {
  try {
    const updates = await request.json()

    const { data: product, error } = await supabaseAdmin
      .from("products")
      .update(updates)
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      console.error("Error updating product:", error)
      return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
    }

    return NextResponse.json({ product })
  } catch (error) {
    console.error("Error in patch product API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE - Delete product
export async function DELETE(request, { params }) {
  try {
    const { error } = await supabaseAdmin.from("products").delete().eq("id", params.id)

    if (error) {
      console.error("Error deleting product:", error)
      return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
    }

    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("Error in delete product API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
