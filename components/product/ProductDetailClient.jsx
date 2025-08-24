"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import AddToCartButton from "./AddToCartButton"
import ReviewForm from "./ReviewForm"
import { useUserSession } from "../../context/UserSessionContext"

export default function ProductDetailClient({ product, relatedProducts }) {
  const [reviews, setReviews] = useState([])
  const [averageRating, setAverageRating] = useState(0)
  const [totalReviews, setTotalReviews] = useState(0)
  const [loadingReviews, setLoadingReviews] = useState(true)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  const { user } = useUserSession()

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
      fetchReviews(product.id)
    }
  }

  // Mock additional images for gallery
  const productImages = [
    product.image_url || "/placeholder-qm58i.png",
    "/premium-liquor-bottle-angle-2.png",
    "/premium-liquor-bottle-back.png",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-amber-600 transition-colors duration-200">
              Home
            </Link>
            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <Link href="/products" className="hover:text-amber-600 transition-colors duration-200">
              Products
            </Link>
            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-amber-600 capitalize">{product.category}</span>
            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-gray-900 truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Product Details */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Product Images */}
            <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 p-8">
              {/* Main Image */}
              <div className="relative aspect-square mb-6 rounded-2xl overflow-hidden bg-white shadow-lg">
                <Image
                  src={productImages[activeImageIndex] || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
                {!product.in_stock && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                    <div className="bg-red-500 text-white px-6 py-3 rounded-full font-semibold text-lg shadow-lg">
                      Out of Stock
                    </div>
                  </div>
                )}
              </div>

              {/* Image Thumbnails */}
              <div className="flex space-x-3 justify-center">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      activeImageIndex === index
                        ? "border-amber-500 shadow-lg scale-110"
                        : "border-gray-200 hover:border-amber-300"
                    }`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} view ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="p-8 lg:p-12 flex flex-col">
              {/* Category Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full border border-amber-200 mb-6 self-start">
                <span className="text-amber-800 text-sm font-semibold capitalize">{product.category}</span>
              </div>

              {/* Product Name */}
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center space-x-2 mb-6">
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-5 h-5 ${
                        star <= Math.round(averageRating) ? "text-amber-400 fill-current" : "text-gray-300"
                      }`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-gray-600">
                  {averageRating > 0 ? `${averageRating} (${totalReviews} reviews)` : "No reviews yet"}
                </span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">
                  {formatPrice(product.price)}
                </div>
                {product.bottle_size && (
                  <p className="text-lg text-gray-600 font-medium">{product.bottle_size} bottle</p>
                )}
                <p className="text-sm text-gray-500 mt-1">Price includes all taxes</p>
              </div>

              {/* Description */}
              {product.description && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">About This Product</h3>
                  <p className="text-gray-700 leading-relaxed">{product.description}</p>
                </div>
              )}

              {/* Add to Cart Section */}
              <div className="mt-auto">
                {product.in_stock ? (
                  <div className="space-y-6">
                    <AddToCartButton product={product} />
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>In stock and ready to ship</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>Secure checkout</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <button
                      disabled
                      className="w-full bg-gray-300 text-gray-500 px-8 py-4 rounded-xl font-semibold cursor-not-allowed text-lg"
                    >
                      Out of Stock
                    </button>
                    <p className="text-sm text-red-600 text-center">This item is currently unavailable</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
          {loadingReviews ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
            </div>
          ) : (
            <>
              {totalReviews > 0 && (
                <div className="flex items-center gap-4 mb-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-amber-600">{averageRating}</div>
                    <div className="text-sm text-gray-600">out of 5</div>
                  </div>
                  <div className="flex-1">
                    <div className="flex text-amber-400 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-6 h-6 ${star <= Math.round(averageRating) ? "fill-current" : "text-gray-300"}`}
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-gray-600">Based on {totalReviews} reviews</p>
                  </div>
                </div>
              )}

              {/* Review Form */}
              <div className="mb-8">
                <ReviewForm productId={product.id} onReviewSubmitted={handleReviewSubmitted} />
              </div>

              {/* Individual Reviews */}
              {reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {review.users?.email?.charAt(0).toUpperCase() || "A"}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{review.users?.email || "Anonymous"}</p>
                            <p className="text-sm text-gray-500">{new Date(review.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex text-amber-400">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`w-4 h-4 ${star <= review.rating ? "fill-current" : "text-gray-300"}`}
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      {review.review_text && <p className="text-gray-700 leading-relaxed">{review.review_text}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <div className="text-6xl mb-4">💬</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
                  <p className="text-gray-600">Be the first to share your thoughts about this product!</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">You might also like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={`/product/${relatedProduct.slug}`}
                  className="group bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <div className="relative h-48">
                    <Image
                      src={relatedProduct.image_url || "/placeholder.svg?height=300&width=300&query=premium liquor"}
                      alt={relatedProduct.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-amber-600 transition-colors duration-200">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                      {formatPrice(relatedProduct.price)}
                    </p>
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
