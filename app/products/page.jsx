import { getFilteredProducts } from "../../lib/products"
import ProductGrid from "../../components/product/ProductGrid"
import ProductFilters from "../../components/product/ProductFilters"
import Navbar from "../../components/layout/Navbar"

export default async function ProductsPage({ searchParams }) {
  const products = await getFilteredProducts(searchParams)

  // Determine the page title based on search/filters
  const getPageTitle = () => {
    if (searchParams.search) {
      return `Search Results for "${searchParams.search}"`
    }
    if (searchParams.category) {
      const categoryName = searchParams.category.charAt(0).toUpperCase() + searchParams.category.slice(1)
      return `${categoryName} Products`
    }
    return "Our Products"
  }

  const getPageDescription = () => {
    if (searchParams.search) {
      return `Found ${products.length} product${products.length !== 1 ? "s" : ""} matching "${searchParams.search}"`
    }
    if (searchParams.category) {
      return `Premium ${searchParams.category} collection for Lagos and Abuja`
    }
    return "Premium liquor collection for Lagos and Abuja"
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{getPageTitle()}</h1>
            <p className="text-gray-600">{getPageDescription()}</p>
          </div>

          <ProductFilters />

          {products.length === 0 ? (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <svg
                  className="w-24 h-24 text-gray-300 mx-auto mb-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchParams.search ? "No products found" : "No products match your filters"}
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchParams.search
                    ? `We couldn't find any products matching "${searchParams.search}". Try different keywords or browse our categories.`
                    : "Try adjusting your filters or check back later for new products!"}
                </p>
                {(searchParams.search || searchParams.category || searchParams.price) && (
                  <a
                    href="/products"
                    className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    View All Products
                  </a>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-sm text-gray-600">
                  Showing {products.length} product{products.length !== 1 ? "s" : ""}
                  {searchParams.search && ` for "${searchParams.search}"`}
                </p>
              </div>
              <ProductGrid products={products} />
            </>
          )}
        </div>
      </div>
    </>
  )
}

export async function generateMetadata({ searchParams }) {
  if (searchParams.search) {
    return {
      title: `Search: ${searchParams.search} - Novadora Liquor Store`,
      description: `Search results for "${searchParams.search}" - Premium liquor delivery in Lagos and Abuja`,
    }
  }

  if (searchParams.category) {
    const categoryName = searchParams.category.charAt(0).toUpperCase() + searchParams.category.slice(1)
    return {
      title: `${categoryName} - Novadora Liquor Store`,
      description: `Premium ${searchParams.category} collection - Liquor delivery in Lagos and Abuja`,
    }
  }

  return {
    title: "Products - Novadora Liquor Store",
    description: "Browse our premium collection of wines, spirits, and champagne",
  }
}
