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
      return `${categoryName} Collection`
    }
    return "Premium Liquor Collection"
  }

  const getPageDescription = () => {
    if (searchParams.search) {
      return `Found ${products.length} product${products.length !== 1 ? "s" : ""} matching "${searchParams.search}"`
    }
    if (searchParams.category) {
      return `Discover our premium ${searchParams.category} collection - expertly curated for connoisseurs`
    }
    return "Explore our carefully curated selection of premium wines, spirits, and champagne"
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        {/* Hero Header */}
        <div className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center">
              <h1 className="text-4xl lg:text-6xl font-bold mb-4">
                <span className="bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-300 bg-clip-text text-transparent">
                  {getPageTitle()}
                </span>
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">{getPageDescription()}</p>

              {/* Breadcrumb */}
              <div className="flex items-center justify-center space-x-2 mt-8 text-sm text-gray-400">
                <span>Home</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-amber-300">Products</span>
                {searchParams.category && (
                  <>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-amber-300 capitalize">{searchParams.category}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <ProductFilters />

          {products.length === 0 ? (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {searchParams.search ? "No products found" : "No products match your filters"}
                </h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  {searchParams.search
                    ? `We couldn't find any products matching "${searchParams.search}". Try different keywords or browse our categories.`
                    : "Try adjusting your filters or check back later for new products!"}
                </p>
                {(searchParams.search || searchParams.category || searchParams.price) && (
                  <a
                    href="/products"
                    className="inline-block bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    View All Products
                  </a>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="mb-8 flex items-center justify-between">
                <p className="text-gray-600 flex items-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800 mr-3">
                    {products.length} product{products.length !== 1 ? "s" : ""}
                  </span>
                  {searchParams.search && `for "${searchParams.search}"`}
                </p>

                {/* View Toggle */}
                <div className="hidden md:flex items-center space-x-2 bg-white rounded-lg p-1 shadow-sm border">
                  <button className="p-2 bg-amber-100 text-amber-600 rounded-md">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-md">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
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
      title: `Search: ${searchParams.search} - Niarobi Liquor Store`,
      description: `Search results for "${searchParams.search}" - Premium liquor delivery in Lagos and Abuja`,
    }
  }

  if (searchParams.category) {
    const categoryName = searchParams.category.charAt(0).toUpperCase() + searchParams.category.slice(1)
    return {
      title: `${categoryName} Collection - Niarobi Liquor Store`,
      description: `Premium ${searchParams.category} collection - Luxury liquor delivery in Lagos and Abuja`,
    }
  }

  return {
    title: "Premium Liquor Collection - Niarobi Liquor Store",
    description: "Browse our premium collection of wines, spirits, and champagne with fast delivery in Lagos and Abuja",
  }
}
