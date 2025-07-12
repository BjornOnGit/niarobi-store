import { supabase } from "../../../lib/supabase/server"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import AddToCartButton from "../../../components/product/AddToCartButton"

async function getProduct(slug) {
  try {
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

async function getRelatedProducts(category, currentProductId) {
  try {
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

export default async function ProductDetailPage({ params }) {
  const product = await getProduct(params.slug)

  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedProducts(product.category, product.id)

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-gray-900">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-gray-900">
            Products
          </Link>
          <span>/</span>
          <span className="text-gray-900 capitalize">{product.category}</span>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        {/* Product Details */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="relative">
              <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={product.image_url || "/placeholder.svg?height=600&width=600"}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
                {!product.in_stock && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-semibold text-xl">Out of Stock</span>
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <div className="mb-4">
                <span className="inline-block px-3 py-1 text-sm font-medium text-blue-800 bg-blue-100 rounded-full capitalize mb-4">
                  {product.category}
                </span>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                {product.bottle_size && (
                  <p className="text-lg text-gray-600 mb-4">Bottle Size: {product.bottle_size}</p>
                )}
              </div>

              <div className="mb-6">
                <p className="text-4xl font-bold text-gray-900 mb-2">{formatPrice(product.price)}</p>
                <p className="text-sm text-gray-500">Price includes all taxes</p>
              </div>

              {product.description && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{product.description}</p>
                </div>
              )}

              {/* Add to Cart Section */}
              <div className="mt-auto">
                {product.in_stock ? (
                  <div className="space-y-4">
                    <AddToCartButton product={product} />
                    <p className="text-sm text-green-600 flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      In stock and ready to ship
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <button
                      disabled
                      className="w-full bg-gray-300 text-gray-500 px-6 py-3 rounded-lg font-semibold cursor-not-allowed"
                    >
                      Out of Stock
                    </button>
                    <p className="text-sm text-red-600">This item is currently unavailable</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">You might also like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={`/product/${relatedProduct.slug}`}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative h-48">
                    <Image
                      src={relatedProduct.image_url || "/placeholder.svg?height=300&width=300"}
                      alt={relatedProduct.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{relatedProduct.name}</h3>
                    <p className="text-lg font-bold text-gray-900">{formatPrice(relatedProduct.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

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
