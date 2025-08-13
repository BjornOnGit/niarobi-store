"use client"

import { useState } from "react"
import { useCart } from "../../context/CartContext"

export default function AddToCartButton({ product }) {
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const { addToCart } = useCart()

  const handleAddToCart = async () => {
    setIsAdding(true)

    // Simulate loading state
    await new Promise((resolve) => setTimeout(resolve, 300))

    addToCart(product, quantity)
    setIsAdding(false)

    // Reset quantity after adding
    setQuantity(1)
  }

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div className="flex items-center space-x-4">
        <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
          Quantity:
        </label>
        <div className="flex items-center border border-gray-300 rounded-md">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50"
            disabled={quantity <= 1}
          >
            -
          </button>
          <input
            type="number"
            id="quantity"
            min="1"
            max="10"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Math.min(10, Number.parseInt(e.target.value) || 1)))}
            className="w-16 px-3 py-2 text-center border-0 focus:outline-none focus:ring-0"
          />
          <button
            type="button"
            onClick={() => setQuantity(Math.min(10, quantity + 1))}
            className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50"
            disabled={quantity >= 10}
          >
            +
          </button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={isAdding || !product.in_stock}
        className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isAdding ? "Adding to Cart..." : `Add to Cart - ${quantity} item${quantity > 1 ? "s" : ""}`}
      </button>
    </div>
  )
}
