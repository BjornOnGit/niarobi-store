"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import AdminLayout from "../../../../components/admin/AdminLayout"
import LoadingSpinner from "../../../../components/ui/LoadingSpinner"
import Link from "next/link"

const ORDER_STATUSES = [
  { value: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  { value: "confirmed", label: "Confirmed", color: "bg-blue-100 text-blue-800" },
  { value: "processing", label: "Processing", color: "bg-purple-100 text-purple-800" },
  { value: "shipped", label: "Shipped", color: "bg-indigo-100 text-indigo-800" },
  { value: "delivered", label: "Delivered", color: "bg-green-100 text-green-800" },
  { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-800" },
]

export default function OrderDetailsPage() {
  const params = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [error, setError] = useState("")

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/admin/orders/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setOrder(data.order)
      } else {
        setError("Order not found")
      }
    } catch (error) {
      console.error("Error fetching order:", error)
      setError("Failed to load order")
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (newStatus) => {
    setUpdatingStatus(true)
    try {
      const response = await fetch(`/api/admin/orders/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_status: newStatus,
        }),
      })

      if (response.ok) {
        setOrder({ ...order, order_status: newStatus })
      } else {
        alert("Failed to update order status. Please try again.")
      }
    } catch (error) {
      console.error("Error updating order status:", error)
      alert("Failed to update order status. Please try again.")
    } finally {
      setUpdatingStatus(false)
    }
  }

  const getStatusColor = (status) => {
    const statusObj = ORDER_STATUSES.find((s) => s.value === status)
    return statusObj ? statusObj.color : "bg-gray-100 text-gray-800"
  }

  useEffect(() => {
    if (params.id) {
      fetchOrder()
    }
  }, [params.id])

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </AdminLayout>
    )
  }

  if (error || !order) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h2>
          <p className="text-gray-600 mb-6">{error || "The order you're looking for doesn't exist."}</p>
          <Link
            href="/admin/orders"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Back to Orders
          </Link>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Order #{order.paystack_reference?.slice(-8) || order.id.slice(-8)}
            </h1>
            <p className="text-gray-600">Placed on {formatDate(order.created_at)}</p>
          </div>
          <Link href="/admin/orders" className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
            ← Back to Orders
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-3 border-b border-gray-200">
                    <div>
                      <h3 className="font-medium text-gray-900">{item.product_name}</h3>
                      <p className="text-sm text-gray-600">
                        {item.bottle_size && `${item.bottle_size} • `}Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{formatPrice(item.product_price * item.quantity)}</p>
                      <p className="text-sm text-gray-600">{formatPrice(item.product_price)} each</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">{formatPrice(order.subtotal)}</span>
                  </div>
                  {order.discount_amount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">Discount ({order.promo_code})</span>
                      <span className="text-green-600">-{formatPrice(order.discount_amount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="text-gray-900">{formatPrice(order.delivery_fee)}</span>
                  </div>
                  <div className="flex justify-between text-base font-semibold pt-2 border-t border-gray-200">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">{formatPrice(order.total_amount)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Payment Reference</p>
                  <p className="text-sm text-gray-900">{order.paystack_reference}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Payment Status</p>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      order.paystack_status === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {order.paystack_status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Status & Customer Info */}
          <div className="space-y-6">
            {/* Order Status */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Status</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Current Status</p>
                  <span
                    className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(order.order_status)}`}
                  >
                    {ORDER_STATUSES.find((s) => s.value === order.order_status)?.label || order.order_status}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Update Status</p>
                  <select
                    value={order.order_status}
                    onChange={(e) => updateOrderStatus(e.target.value)}
                    disabled={updatingStatus}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {ORDER_STATUSES.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                  {updatingStatus && <p className="text-sm text-gray-600 mt-2">Updating status...</p>}
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Customer Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-600">Email</p>
                  <p className="text-sm text-gray-900">{order.customer_email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Delivery City</p>
                  <p className="text-sm text-gray-900">{order.delivery_city}</p>
                </div>
              </div>
            </div>

            {/* Order Timeline */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Timeline</h2>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Order Placed</p>
                    <p className="text-xs text-gray-600">{formatDate(order.created_at)}</p>
                  </div>
                </div>
                {order.order_status !== "pending" && (
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Status: {ORDER_STATUSES.find((s) => s.value === order.order_status)?.label}
                      </p>
                      <p className="text-xs text-gray-600">Current status</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
