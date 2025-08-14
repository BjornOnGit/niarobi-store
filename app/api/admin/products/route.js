import { NextResponse } from "next/server"
import { supabaseAdmin } from "../../../../lib/supabase/admin"

// GET - Fetch all products for admin
export async function GET() {
  try {
    const { data: products, error } = await supabaseAdmin
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching products:", error)
      return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
    }

    return NextResponse.json({ products: products || [] })
  } catch (error) {
    console.error("Error in admin products API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Create new product
export async function POST(request) {
  try {
    const productData = await request.json()

    // Validate required fields
    if (!productData.name || !productData.price || !productData.category) {
      return NextResponse.json({ error: "Name, price, and category are required" }, { status: 400 })
    }

    // Check if slug already exists
    const { data: existingProduct } = await supabaseAdmin
      .from("products")
      .select("id")
      .eq("slug", productData.slug)
      .single()

    if (existingProduct) {
      // Generate a unique slug by appending a number
      let counter = 1
      let uniqueSlug = `${productData.slug}-${counter}`

      while (true) {
        const { data: slugCheck } = await supabaseAdmin.from("products").select("id").eq("slug", uniqueSlug).single()

        if (!slugCheck) {
          productData.slug = uniqueSlug
          break
        }

        counter++
        uniqueSlug = `${productData.slug}-${counter}`
      }
    }

    const { data: product, error } = await supabaseAdmin.from("products").insert(productData).select().single()

    if (error) {
      console.error("Error creating product:", error)
      return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
    }

    return NextResponse.json({ product }, { status: 201 })
  } catch (error) {
    console.error("Error in create product API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
