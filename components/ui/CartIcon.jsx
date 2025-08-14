"use client"

import { useCart } from "../../context/CartContext"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function CartIcon() {
  const { cartItemCount } = useCart()
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (cartItemCount > 0) {
      setIsAnimating(true)
      const timer = setTimeout(() => setIsAnimating(false), 300)
      return () => clearTimeout(timer)
    }
  }, [cartItemCount])

  return (
    <Link
      href="/cart"
      className="relative inline-flex items-center p-3 text-gray-700 hover:text-amber-600 transition-all duration-300 hover:bg-amber-50 rounded-xl group"
    >
      <div
        className={`transition-transform duration-300 ${isAnimating ? "scale-110" : "scale-100"} group-hover:scale-110`}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8m-8 0a2 2 0 100 4 2 2 0 000-4zm8 0a2 2 0 100 4 2 2 0 000-4z"
          />
        </svg>
      </div>

      {cartItemCount > 0 && (
        <span
          className={`absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg transition-all duration-300 ${isAnimating ? "animate-bounce" : ""}`}
        >
          {cartItemCount > 99 ? "99+" : cartItemCount}
        </span>
      )}

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
        {cartItemCount === 0 ? "Your cart is empty" : `${cartItemCount} item${cartItemCount > 1 ? "s" : ""} in cart`}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
      </div>
    </Link>
  )
}
