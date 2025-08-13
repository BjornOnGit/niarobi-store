"use client"

import { useCart } from "../../context/CartContext"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react" // Import useEffect
import PromoCodeInput from "../../components/cart/PromoCodeInput"
import Navbar from "../../components/layout/Navbar"
import { getDeliveryFee } from "../../lib/delivery" // Import getDeliveryFee
import { supabase } from "../../lib/supabase/client"

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart, cartTotal, cartItemCount } = useCart()
  const [isClearing, setIsClearing] = useState(false)
  const [appliedPromo, setAppliedPromo] = useState(null)
  const [customerEmail, setCustomerEmail] = useState("")
  const [deliveryCity, setDeliveryCity] = useState("")
  const [deliveryFee, setDeliveryFee] = useState(0) // State for dynamic delivery fee
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false)
  const [checkoutError, setCheckoutError] = useState("")
  const [availableCities, setAvailableCities] = useState([]) // New state for cities

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)
  }

  // Effect to fetch available cities
  useEffect(() => {
    const fetchCities = async () => {
      const { data, error } = await supabase.from("delivery_cities").select("name").order("name", { ascending: true })
      if (error) {
        console.error("Error fetching delivery cities:", error)
      } else {
        setAvailableCities(data.map((city) => city.name))
      }
    }
    fetchCities()
  }, [])

  // Effect to update delivery fee when city changes
  useEffect(() => {
    const fetchFee = async () => {
      const fee = await getDeliveryFee(deliveryCity)
      setDeliveryFee(fee)
    }
    fetchFee()
  }, [deliveryCity])

  const handleClearCart = async () => {
    setIsClearing(true)
    await new Promise((resolve) => setTimeout(resolve, 300))
    clearCart()
    setAppliedPromo(null)
    setIsClearing(false)
  }

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId)
    } else {
      updateQuantity(productId, newQuantity)
    }
  }

  const handlePromoApplied = (promoData) => {
    setAppliedPromo(promoData)
  }

  const discountAmount = appliedPromo ? appliedPromo.discountAmount : 0
  const finalTotal = cartTotal - discountAmount + deliveryFee

  const handleProceedToCheckout = async () => {
    setCheckoutError("")
    if (!customerEmail || !deliveryCity) {
      setCheckoutError("Please enter your email and select a delivery city.")
      return
    }

    if (cart.items.length === 0) {
      setCheckoutError("Your cart is empty.")
      return
    }

    setIsProcessingCheckout(true)

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartItems: cart.items,
          customerEmail,
          deliveryCity,
          promoCodeData: appliedPromo,
          deliveryFee, // Pass the dynamically fetched delivery fee
        }),
      })

      const data = await response.json()

      if (response.ok && data.authorization_url) {
        window.location.href = data.authorization_url // Redirect to Paystack
      } else {
        setCheckoutError(data.error || "Failed to initiate checkout. Please try again.")
      }
    } catch (error) {
      console.error("Checkout error:", error)
      setCheckoutError("An unexpected error occurred during checkout. Please try again.")
    } finally {
      setIsProcessingCheckout(false)
    }
  }

  if (cart.items.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <div className="max-w-md mx-auto">
                <svg
                  className="w-24 h-24 text-gray-300 mx-auto mb-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8m-8 0a2 2 0 100 4 2 2 0 000-4zm8 0a2 2 0 100 4 2 2 0 000-4z"
                  />
                </svg>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
                <p className="text-gray-600 mb-8">Add some premium liquor to get started!</p>
                <Link
                  href="/products"
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Browse Products
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <button
              onClick={handleClearCart}
              disabled={isClearing}
              className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
            >
              {isClearing ? "Clearing..." : "Clear Cart"}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Cart Items ({cartItemCount} item{cartItemCount !== 1 ? "s" : ""})
                  </h2>
                </div>

                <div className="divide-y divide-gray-200">
                  {cart.items.map((item) => (
                    <div key={item.id} className="p-6">
                      <div className="flex items-start space-x-4">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                            <Image
                              src={item.image_url || "/placeholder.svg?height=200&width=200"}
                              alt={item.name}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">
                                <Link href={`/product/${item.slug}`} className="hover:text-blue-600 transition-colors">
                                  {item.name}
                                </Link>
                              </h3>
                              {item.category && (
                                <p className="text-sm text-gray-500 capitalize mt-1">{item.category}</p>
                              )}
                              {item.bottle_size && (
                                <p className="text-sm text-gray-500 mt-1">Size: {item.bottle_size}</p>
                              )}
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-600 hover:text-red-800 text-sm font-medium ml-4"
                            >
                              Remove
                            </button>
                          </div>

                          <div className="flex items-center justify-between mt-4">
                            {/* Quantity Controls */}
                            <div className="flex items-center border border-gray-300 rounded-md">
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                              >
                                -
                              </button>
                              <input
                                type="number"
                                min="1"
                                max="10"
                                value={item.quantity}
                                onChange={(e) =>
                                  handleQuantityChange(item.id, Math.max(1, Number.parseInt(e.target.value) || 1))
                                }
                                className="w-16 px-3 py-2 text-center border-0 focus:outline-none focus:ring-0"
                              />
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                                disabled={item.quantity >= 10}
                              >
                                +
                              </button>
                            </div>

                            {/* Price */}
                            <div className="text-right">
                              <p className="text-lg font-semibold text-gray-900">
                                {formatPrice(item.price * item.quantity)}
                              </p>
                              <p className="text-sm text-gray-500">{formatPrice(item.price)} each</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Continue Shopping */}
              <div className="mt-6">
                <Link
                  href="/products"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal ({cartItemCount} items)</span>
                    <span className="text-gray-900">{formatPrice(cartTotal)}</span>
                  </div>

                  {appliedPromo && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">Discount ({appliedPromo.code})</span>
                      <span className="text-green-600">-{formatPrice(discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="text-gray-900">{deliveryFee > 0 ? formatPrice(deliveryFee) : "Select city"}</span>
                  </div>

                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span className="text-base font-semibold text-gray-900">Total</span>
                      <span className="text-base font-semibold text-gray-900">{formatPrice(finalTotal)}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Inclusive of all taxes</p>
                  </div>
                </div>

                {/* Customer Info Form */}
                <div className="mb-6">
                  <h3 className="text-md font-semibold text-gray-900 mb-3">Customer Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="customer-email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="customer-email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="delivery-city" className="block text-sm font-medium text-gray-700 mb-1">
                        Delivery City
                      </label>
                      <select
                        id="delivery-city"
                        value={deliveryCity}
                        onChange={(e) => setDeliveryCity(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select City</option>
                        {availableCities.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Promo Code Input */}
                <PromoCodeInput cartTotal={cartTotal} onPromoApplied={handlePromoApplied} />

                {checkoutError && <p className="text-sm text-red-600 mt-4">{checkoutError}</p>}

                <button
                  onClick={handleProceedToCheckout}
                  disabled={isProcessingCheckout || cart.items.length === 0 || !customerEmail || !deliveryCity}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors mb-4 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessingCheckout ? "Processing Payment..." : "Proceed to Checkout"}
                </button>

                <div className="text-center">
                  <p className="text-xs text-gray-500">Secure checkout powered by Paystack</p>
                </div>

                {/* Trust Indicators */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Free delivery in Lagos & Abuja
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Secure payment processing
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Age verification required
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
