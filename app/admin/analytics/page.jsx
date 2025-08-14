"use client"

import { useState, useEffect } from "react"
import AdminLayout from "../../../components/admin/AdminLayout"
import LoadingSpinner from "../../../components/ui/LoadingSpinner"

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState({
    salesByMonth: [],
    topProducts: [],
    ordersByStatus: [],
    revenueByCity: [],
    promoCodeUsage: [],
  })
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("30") // days

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/admin/analytics?days=${timeRange}`)
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  return (
    <AdminLayout>
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Top Products */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Selling Products</h2>
              <div className="space-y-4">
                {analytics.topProducts.map((product, index) => (
                  <div key={product.product_name} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-medium text-gray-900">{product.product_name}</p>
                        <p className="text-sm text-gray-600">{product.total_quantity} units sold</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{formatPrice(product.total_revenue)}</p>
                    </div>
                  </div>
                ))}
                {analytics.topProducts.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No sales data available for this period</p>
                )}
              </div>
            </div>

            {/* Orders by Status */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Orders by Status</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {analytics.ordersByStatus.map((status) => (
                  <div key={status.order_status} className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">{status.count}</p>
                    <p className="text-sm text-gray-600 capitalize">{status.order_status}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Revenue by City */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Revenue by City</h2>
              <div className="space-y-4">
                {analytics.revenueByCity.map((city) => (
                  <div key={city.delivery_city} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{city.delivery_city}</p>
                      <p className="text-sm text-gray-600">{city.order_count} orders</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{formatPrice(city.total_revenue)}</p>
                    </div>
                  </div>
                ))}
                {analytics.revenueByCity.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No revenue data available for this period</p>
                )}
              </div>
            </div>

            {/* Promo Code Usage */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Promo Code Performance</h2>
              <div className="space-y-4">
                {analytics.promoCodeUsage.map((promo) => (
                  <div key={promo.promo_code} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{promo.promo_code}</p>
                      <p className="text-sm text-gray-600">{promo.usage_count} times used</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{formatPrice(promo.total_discount)}</p>
                      <p className="text-sm text-gray-600">Total discount given</p>
                    </div>
                  </div>
                ))}
                {analytics.promoCodeUsage.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No promo code usage data for this period</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
