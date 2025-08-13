import Image from "next/image"
import Link from "next/link"

export default function ProductCard({ product }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-64 w-full">
        <Image
          src={product.image_url || "/placeholder.svg?height=400&width=300"}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {!product.in_stock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold text-lg">Out of Stock</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>

        {product.description && <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>}

        <div className="flex items-center justify-between mb-3">
          <span className="text-xl font-bold text-gray-900">{formatPrice(product.price)}</span>
          {product.bottle_size && (
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{product.bottle_size}</span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 capitalize">{product.category}</span>

          <Link
            href={`/product/${product.slug}`}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}
