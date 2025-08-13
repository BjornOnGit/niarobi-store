"use client"

import { useState } from "react"
import Navbar from "../../components/layout/Navbar"
import LoadingSpinner from "../../components/ui/LoadingSpinner"

export default function OrderLookupPage() {
  const [orderReference, setOrderReference] = useState("")
  const [orderData, setOrderData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleLookup = async (e) => {
    e.preventDefault()
    setError("")
    setOrderData(null)

    if (!orderReference.trim()) {
      setError("Please enter an order reference.")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/order-details?reference=${orderReference.trim()}`)
      const data = await response.json()

      if (response.ok && data.order) {
        setOrderData(data.order)
      } else {
        setError(data.error || "Order not found. Please check the reference and try again.")
      }
    } catch (err) {
      console.error("Error fetching order:", err)
      setError("An error occurred while fetching the order. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Order Lookup</h1>

          <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
            <form onSubmit={handleLookup} className="space-y-4">
              <div>
                <label htmlFor="order-ref" className="block text-sm font-medium text-gray-700 mb-2">
                  Enter Order Reference
                </label>
                <input
                  type="text"
                  id="order-ref"
                  value={orderReference}
                  onChange={(e) => setOrderReference(e.target.value)}
                  placeholder="e.g., 01234567-89ab-cdef-0123-456789abcdef"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isLoading}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !orderReference.trim()}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? "Searching..." : "Lookup Order"}
              </button>
              {error && <p className="text-sm text-red-600 mt-3 text-center">{error}</p>}
            </form>

            {isLoading && (
              <div className="mt-8 text-center">
                <LoadingSpinner size="md" />
                <p className="text-gray-600 mt-2">Fetching order details...</p>
              </div>
            )}

            {orderData && (
              <div className="mt-8 text-left border-t border-gray-200 pt-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Order Details</h3>
                <p className="text-gray-700 mb-2">
                  Order Reference: <span className="font-bold">{orderData.paystack_reference}</span>
                </p>
                <p className="text-gray-700 mb-2">
                  Customer Email: <span className="font-bold">{orderData.customer_email}</span>
                </p>
                <p className="text-gray-700 mb-2">
                  Delivery City: <span className="font-bold">{orderData.delivery_city}</span>
                </p>
                <p className="text-gray-700 mb-2">
                  Order Status: <span className="font-bold capitalize">{orderData.order_status}</span>
                </p>
                <div className="space-y-1 mt-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Items:</h4>
                  {orderData.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm text-gray-600">
                      <span>
                        {item.product_name} ({item.quantity}x)
                      </span>
                      <span>{formatPrice(item.product_price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatPrice(orderData.subtotal)}</span>
                  </div>
                  {orderData.discount_amount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount ({orderData.promo_code})</span>
                      <span>-{formatPrice(orderData.discount_amount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Delivery Fee</span>
                    <span>{formatPrice(orderData.delivery_fee)}</span>
                  </div>
                  <div className="flex justify-between text-base font-semibold text-gray-900 mt-2">
                    <span>Total Paid</span>
                    <span>{formatPrice(orderData.total_amount)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
