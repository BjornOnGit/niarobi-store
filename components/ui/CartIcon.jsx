"use client"

import { useCart } from "../../context/CartContext"
import Link from "next/link"

export default function CartIcon() {
  const { cartItemCount } = useCart()

  return (
    <Link href="/cart" className="relative inline-flex items-center p-2 text-gray-600 hover:text-gray-900">
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8m-8 0a2 2 0 100 4 2 2 0 000-4zm8 0a2 2 0 100 4 2 2 0 000-4z"
        />
      </svg>
      {cartItemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {cartItemCount > 99 ? "99+" : cartItemCount}
        </span>
      )}
    </Link>
  )
}
