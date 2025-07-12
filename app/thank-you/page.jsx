"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useCart } from "../../context/CartContext"
import Link from "next/link"
import Navbar from "../../components/layout/Navbar"
import LoadingSpinner from "../../components/ui/LoadingSpinner"
// Removed: import { getOrderDetails } from "@/lib/orders" // This is now fetched via API route

export default function ThankYouPage() {
  const searchParams = useSearchParams()
  const { clearCart } = useCart()
  const [paymentStatus, setPaymentStatus] = useState("verifying") // 'verifying', 'success', 'failed'
  const [message, setMessage] = useState("Verifying your payment...")
  const [orderData, setOrderData] = useState(null) // State to store full order details

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)
  }

  useEffect(() => {
    const verifyAndFetchOrder = async () => {
      const trxref = searchParams.get("trxref")
      const reference = searchParams.get("reference")

      if (!trxref && !reference) {
        setPaymentStatus("failed")
        setMessage("Payment verification failed: No transaction reference found.")
        return
      }

      const paystackReference = trxref || reference

      try {
        // Step 1: Verify payment with Paystack
        const verifyResponse = await fetch("/api/paystack/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reference: paystackReference }),
        })

        const verifyData = await verifyResponse.json()

        if (verifyResponse.ok && verifyData.status === "success") {
          // Step 2: Payment successful, now fetch full order details from our new API route
          const orderDetailsResponse = await fetch(`/api/order-details?reference=${paystackReference}`)
          const orderDetailsData = await orderDetailsResponse.json()

          if (orderDetailsResponse.ok && orderDetailsData.order) {
            setOrderData(orderDetailsData.order)
            setPaymentStatus("success")
            setMessage("Payment successful! Your order has been placed.")
            clearCart() // Clear cart on successful order
          } else {
            // Order not found in DB despite Paystack success or API error
            setPaymentStatus("failed")
            setMessage(
              orderDetailsData.error ||
                "Payment successful, but order details could not be retrieved. Please contact support.",
            )
          }
        } else {
          setPaymentStatus("failed")
          setMessage(
            verifyData.message ||
              "Payment verification failed. Please contact support if you believe this is an error.",
          )
        }
      } catch (error) {
        console.error("Error during payment verification or order fetching:", error)
        setPaymentStatus("failed")
        setMessage("An error occurred. Please try again or contact support.")
      }
    }

    verifyAndFetchOrder()
  }, [searchParams, clearCart])

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center bg-white p-8 rounded-lg shadow-lg">
          {paymentStatus === "verifying" && (
            <>
              <LoadingSpinner size="lg" />
              <h2 className="text-2xl font-bold text-gray-900 mt-6 mb-3">Verifying Payment...</h2>
              <p className="text-gray-600">{message}</p>
            </>
          )}

          {paymentStatus === "success" && orderData && (
            <>
              <svg className="w-20 h-20 text-green-500 mx-auto mb-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Thank You for Your Order!</h2>
              <p className="text-gray-600 mb-6">{message}</p>

              <div className="text-left border-t border-b border-gray-200 py-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Summary</h3>
                <p className="text-gray-700 mb-2">
                  Order Reference: <span className="font-bold">{orderData.paystack_reference}</span>
                </p>
                <p className="text-gray-700 mb-2">
                  Customer Email: <span className="font-bold">{orderData.customer_email}</span>
                </p>
                <p className="text-gray-700 mb-2">
                  Delivery City: <span className="font-bold">{orderData.delivery_city}</span>
                </p>
                <div className="space-y-1 mt-4">
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

              <div className="space-y-3">
                <Link
                  href="/products"
                  className="block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Continue Shopping
                </Link>
                <Link href="/" className="block text-gray-600 hover:text-gray-800 transition-colors">
                  Go to Homepage
                </Link>
              </div>
            </>
          )}

          {paymentStatus === "failed" && (
            <>
              <svg className="w-20 h-20 text-red-500 mx-auto mb-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Payment Failed</h2>
              <p className="text-gray-600 mb-6">{message}</p>
              <div className="space-y-3">
                <Link
                  href="/cart"
                  className="block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Return to Cart
                </Link>
                <Link href="/products" className="block text-gray-600 hover:text-gray-800 transition-colors">
                  Continue Shopping
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
