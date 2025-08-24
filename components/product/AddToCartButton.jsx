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
    <div className="space-y-6">
      {/* Quantity Selector */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
        <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
          Quantity:
        </label>
        <div className="flex items-center border border-gray-300 rounded-lg bg-white">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-l-lg transition-colors duration-200"
            disabled={quantity <= 1}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <input
            type="number"
            id="quantity"
            min="1"
            max="10"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Math.min(10, Number.parseInt(e.target.value) || 1)))}
            className="w-16 px-3 py-2 text-center border-0 focus:outline-none focus:ring-0 bg-transparent font-semibold"
            readOnly
          />
          <button
            type="button"
            onClick={() => setQuantity(Math.min(10, quantity + 1))}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-r-lg transition-colors duration-200"
            disabled={quantity >= 10}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={isAdding || !product.in_stock}
        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl text-lg flex items-center justify-center space-x-2"
      >
        {isAdding ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Adding to Cart...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8m-8 0a2 2 0 100 4 2 2 0 000-4zm8 0a2 2 0 100 4 2 2 0 000-4z"
              />
            </svg>
            <span>Add {quantity} to Cart</span>
          </>
        )}
      </button>

      {/* Additional Info */}
      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          <span>Fast delivery</span>
        </div>
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            />
          </svg>
          <span>Secure payment</span>
        </div>
      </div>
    </div>
  )
}
