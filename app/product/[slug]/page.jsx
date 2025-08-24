import { getSupabaseServerClient } from "../../../lib/supabase/server" // Keep this import for server-side data fetching
import { notFound } from "next/navigation"
import Navbar from "../../../components/layout/Navbar"
import ProductDetailClient from "../../../components/product/ProductDetailClient"

// This function runs on the server
async function getProduct(slug) {
  try {
    const supabase = getSupabaseServerClient()
    const { data: product, error } = await supabase.from("products").select("*").eq("slug", slug).single()

    if (error || !product) {
      return null
    }

    return product
  } catch (error) {
    console.error("Error fetching product:", error)
    return null
  }
}

// This function runs on the server
async function getRelatedProducts(category, currentProductId) {
  try {
    const supabase = getSupabaseServerClient()
    const { data: products, error } = await supabase
      .from("products")
      .select("*")
      .eq("category", category)
      .eq("in_stock", true)
      .neq("id", currentProductId)
      .limit(4)

    if (error) {
      console.error("Error fetching related products:", error)
      return []
    }

    return products || []
  } catch (error) {
    console.error("Error fetching related products:", error)
    return []
  }
}

// This is the Server Component that fetches initial data
export default async function ProductDetailPage({ params }) {
  const product = await getProduct(params.slug)

  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedProducts(product.category, product.id)

  return (
    <>
      <Navbar />
      <ProductDetailClient product={product} relatedProducts={relatedProducts} />
    </>
  )
}

// This function also runs on the server for SEO metadata
export async function generateMetadata({ params }) {
  const product = await getProduct(params.slug)

  if (!product) {
    return {
      title: "Product Not Found - Niarobi Liquor Store",
    }
  }

  return {
    title: `${product.name} - Niarobi Liquor Store`,
    description: product.description || `Buy ${product.name} - Premium liquor delivery in Lagos and Abuja`,
  }
}
