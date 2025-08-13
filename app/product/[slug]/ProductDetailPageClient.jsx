"use client"
import Image from "next/image"
import Link from "next/link"
import AddToCartButton from "../../../components/product/AddToCartButton"
import ReviewForm from "../../../components/product/ReviewForm" // Import ReviewForm
import { useUserSession } from "../../../context/UserSessionContext" // Import useUserSession
import { useState, useEffect } from "react" // Import useState and useEffect

export default function ProductDetailPageClient({ productData, relatedProductsData, params }) {
  const [product, setProduct] = useState(productData)
  const [relatedProducts, setRelatedProducts] = useState(relatedProductsData)
  const [reviews, setReviews] = useState([])
  const [averageRating, setAverageRating] = useState(0)
  const [totalReviews, setTotalReviews] = useState(0)
  const [loadingProduct, setLoadingProduct] = useState(false)
  const [loadingReviews, setLoadingReviews] = useState(true)

  const { user } = useUserSession() // Get user from session context

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const fetchReviews = async (productId) => {
    setLoadingReviews(true)
    try {
      const response = await fetch(`/api/reviews?productId=${productId}`)
      const data = await response.json()
      if (response.ok) {
        setReviews(data.reviews)
        setAverageRating(data.averageRating)
        setTotalReviews(data.totalReviews)
      } else {
        console.error("Failed to fetch reviews:", data.error)
        setReviews([])
        setAverageRating(0)
        setTotalReviews(0)
      }
    } catch (error) {
      console.error("Error fetching reviews:", error)
      setReviews([])
      setAverageRating(0)
      setTotalReviews(0)
    } finally {
      setLoadingReviews(false)
    }
  }

  useEffect(() => {
    if (product?.id) {
      fetchReviews(product.id)
    }
  }, [product?.id])

  const handleReviewSubmitted = () => {
    if (product?.id) {
      fetchReviews(product.id) // Re-fetch reviews after a new one is submitted
    }
  }

  if (loadingProduct) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading product details...</p>
      </div>
    )
  }

  // If product is null after loading, it means notFound() was called
  if (!product) {
    return null // notFound() handles the rendering
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

        {/* Reviews Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
          {loadingReviews ? (
            <div className="flex justify-center items-center py-8">
              <p className="text-gray-600">Loading reviews...</p>
            </div>
          ) : (
            <>
              {totalReviews > 0 && (
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-3xl font-bold text-gray-900">{averageRating}</span>
                  <div className="flex text-yellow-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className={star <= Math.round(averageRating) ? "opacity-100" : "opacity-30"}>
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-gray-600">({totalReviews} reviews)</span>
                </div>
              )}

              {/* Review Form */}
              <div className="mb-8">
                <ReviewForm
                  productId={product.id}
                  userId={user?.id} // Pass user ID if available
                  onReviewSubmitted={handleReviewSubmitted}
                />
              </div>

              {/* Individual Reviews */}
              {reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="bg-white p-6 rounded-lg shadow-sm border">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">{review.users?.email || "Anonymous"}</span>
                          <span className="text-sm text-gray-500">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex text-yellow-500">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star} className={star <= review.rating ? "opacity-100" : "opacity-30"}>
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      {review.review_text && <p className="text-gray-700 leading-relaxed">{review.review_text}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-600">
                  <p>No reviews yet. Be the first to leave one!</p>
                </div>
              )}
            </>
          )}
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
