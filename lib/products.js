import { getSupabaseServerClient } from "./supabase/server"

export async function getFilteredProducts(searchParams = {}) {
  try {
    const supabase = getSupabaseServerClient()
    let query = supabase.from("products").select("*").eq("in_stock", true)

    // Search functionality
    if (searchParams.search) {
      const searchTerm = searchParams.search.toLowerCase()
      query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`)
    }

    // Category filter
    if (searchParams.category) {
      query = query.eq("category", searchParams.category)
    }

    // Price range filter
    if (searchParams.price) {
      const [minPrice, maxPrice] = searchParams.price.split("-").map(Number)
      query = query.gte("price", minPrice)
      if (maxPrice < 999999) {
        query = query.lte("price", maxPrice)
      }
    }

    // Sorting
    switch (searchParams.sort) {
      case "oldest":
        query = query.order("created_at", { ascending: true })
        break
      case "price-low":
        query = query.order("price", { ascending: true })
        break
      case "price-high":
        query = query.order("price", { ascending: false })
        break
      case "name":
        query = query.order("name", { ascending: true })
        break
      case "relevance":
        // For relevance, we'll order by name match first, then by popularity/newest
        if (searchParams.search) {
          query = query.order("name", { ascending: true })
        } else {
          query = query.order("created_at", { ascending: false })
        }
        break
      default: // newest
        query = query.order("created_at", { ascending: false })
    }

    const { data: products, error } = await query

    if (error) {
      console.error("Error fetching products:", error)
      return []
    }

    return products || []
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}
