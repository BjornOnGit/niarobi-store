"use client"

import { useCart } from "../../context/CartContext"

// Test component to verify cart functionality
export default function TestCartPage() {
  const { cart, addToCart, updateQuantity, removeFromCart, clearCart, cartTotal, cartItemCount } = useCart()

  const testProduct = {
    id: "test-1",
    name: "Test Product",
    price: 25000,
    image_url: "/placeholder.svg?height=200&width=200",
    slug: "test-product",
    in_stock: true,
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Cart Test Page</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Test Actions */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
          <div className="space-y-4">
            <button
              onClick={() => addToCart(testProduct, 1)}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add Test Product
            </button>
            <button
              onClick={() => clearCart()}
              className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Clear Cart
            </button>
          </div>
        </div>

        {/* Cart State */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Cart State</h2>
          <div className="space-y-2">
            <p>
              <strong>Items in cart:</strong> {cartItemCount}
            </p>
            <p>
              <strong>Total:</strong> {formatPrice(cartTotal)}
            </p>
          </div>

          {cart.items.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Cart Items:</h3>
              {cart.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      {formatPrice(item.price)} x {item.quantity}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-2 py-1 bg-gray-200 rounded"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2 py-1 bg-gray-200 rounded"
                    >
                      +
                    </button>
                    <button onClick={() => removeFromCart(item.id)} className="px-2 py-1 bg-red-500 text-white rounded">
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
