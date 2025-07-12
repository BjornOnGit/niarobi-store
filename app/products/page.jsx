import { getFilteredProducts } from "../../lib/products"
import ProductGrid from "../../components/product/ProductGrid"
import ProductFilters from "../../components/product/ProductFilters"
import Navbar from "../../components/layout/Navbar"

export default async function ProductsPage({ searchParams }) {
  const products = await getFilteredProducts(searchParams)

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Products</h1>
            <p className="text-gray-600">Premium liquor collection for Lagos and Abuja</p>
          </div>

          <ProductFilters />

          {products.length === 0 ? (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500">Try adjusting your filters or check back later for new products!</p>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-sm text-gray-600">
                  Showing {products.length} product{products.length !== 1 ? "s" : ""}
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

export const metadata = {
  title: "Products - Novadora Liquor Store",
  description: "Browse our premium collection of wines, spirits, and champagne",
}
