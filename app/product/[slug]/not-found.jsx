import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
        <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or may have been removed.</p>
        <div className="space-y-3">
          <Link
            href="/products"
            className="block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Browse All Products
          </Link>
          <Link href="/" className="block text-gray-600 hover:text-gray-800 transition-colors">
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  )
}
