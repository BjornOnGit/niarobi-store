"use client"

import { useState } from "react"

export default function PromoCodeInput({ cartTotal, onPromoApplied }) {
  const [promoCode, setPromoCode] = useState("")
  const [isValidating, setIsValidating] = useState(false)
  const [error, setError] = useState("")
  const [appliedPromo, setAppliedPromo] = useState(null)

  const validatePromoCode = async () => {
    if (!promoCode.trim()) {
      setError("Please enter a promo code")
      return
    }

    setIsValidating(true)
    setError("")

    try {
      const response = await fetch("/api/promo/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: promoCode.trim(),
          orderAmount: cartTotal,
        }),
      })

      const data = await response.json()

      if (response.ok && data.valid) {
        setAppliedPromo(data)
        setError("")
        setPromoCode("")
        onPromoApplied(data)
      } else {
        setError(data.error || "Invalid promo code")
        setAppliedPromo(null)
        onPromoApplied(null)
      }
    } catch (error) {
      console.error("Error validating promo code:", error)
      setError("Failed to validate promo code. Please try again.")
      setAppliedPromo(null)
      onPromoApplied(null)
    } finally {
      setIsValidating(false)
    }
  }

  const removePromoCode = () => {
    setAppliedPromo(null)
    setError("")
    setPromoCode("")
    onPromoApplied(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    validatePromoCode()
  }

  return (
    <div className="border-t border-gray-200 pt-4">
      {!appliedPromo ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="promo-code" className="block text-sm font-medium text-gray-700 mb-2">
              Promo Code
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                id="promo-code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                placeholder="Enter promo code"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                disabled={isValidating}
                style={{ color: "#1f2937 !important", backgroundColor: "#ffffff !important" }}
              />
              <button
                type="submit"
                disabled={isValidating || !promoCode.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isValidating ? "Checking..." : "Apply"}
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </form>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-md p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-800">Promo Code Applied!</p>
              <p className="text-sm text-green-600">{appliedPromo.message}</p>
              <p className="text-xs text-green-600 mt-1">Code: {appliedPromo.code}</p>
            </div>
            <button onClick={removePromoCode} className="text-green-600 hover:text-green-800 text-sm font-medium">
              Remove
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
