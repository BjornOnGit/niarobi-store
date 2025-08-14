"use client"

import { useState, useEffect } from "react"
import AdminLayout from "../../../components/admin/AdminLayout"
import LoadingSpinner from "../../../components/ui/LoadingSpinner"
import Link from "next/link"

export default function AdminPromoCodesPage() {
  const [promoCodes, setPromoCodes] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString) => {
    if (!dateString) return "No expiry"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const fetchPromoCodes = async () => {
    try {
      const response = await fetch("/api/admin/promo-codes")
      if (response.ok) {
        const data = await response.json()
        setPromoCodes(data.promoCodes)
      }
    } catch (error) {
      console.error("Error fetching promo codes:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (promoId, promoCode) => {
    if (!confirm(`Are you sure you want to delete promo code "${promoCode}"? This action cannot be undone.`)) {
      return
    }

    setDeleting(promoId)
    try {
      const response = await fetch(`/api/admin/promo-codes/${promoId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setPromoCodes(promoCodes.filter((p) => p.id !== promoId))
      } else {
        alert("Failed to delete promo code. Please try again.")
      }
    } catch (error) {
      console.error("Error deleting promo code:", error)
      alert("Failed to delete promo code. Please try again.")
    } finally {
      setDeleting(null)
    }
  }

  const toggleActive = async (promoId, currentStatus) => {
    try {
      const response = await fetch(`/api/admin/promo-codes/${promoId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          is_active: !currentStatus,
        }),
      })

      if (response.ok) {
        setPromoCodes(promoCodes.map((p) => (p.id === promoId ? { ...p, is_active: !currentStatus } : p)))
      } else {
        alert("Failed to update promo code status. Please try again.")
      }
    } catch (error) {
      console.error("Error updating promo code:", error)
      alert("Failed to update promo code status. Please try again.")
    }
  }

  const getDiscountDisplay = (promoCode) => {
    if (promoCode.discount_type === "percentage") {
      return `${promoCode.discount_value}%`
    } else {
      return formatPrice(promoCode.discount_value)
    }
  }

  const isExpired = (validUntil) => {
    if (!validUntil) return false
    return new Date(validUntil) < new Date()
  }

  useEffect(() => {
    fetchPromoCodes()
  }, [])

  return (
    <AdminLayout>
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Promo Codes</h1>
          <Link
            href="/admin/promo-codes/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Create Promo Code
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Discount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Min Order
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expires
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {promoCodes.map((promoCode) => (
                    <tr key={promoCode.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{promoCode.code}</div>
                        {promoCode.description && <div className="text-sm text-gray-500">{promoCode.description}</div>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{getDiscountDisplay(promoCode)}</div>
                        {promoCode.max_discount_amount && promoCode.discount_type === "percentage" && (
                          <div className="text-xs text-gray-500">Max: {formatPrice(promoCode.max_discount_amount)}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatPrice(promoCode.min_order_amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {promoCode.used_count || 0}
                        {promoCode.usage_limit && ` / ${promoCode.usage_limit}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className={`text-sm ${isExpired(promoCode.valid_until) ? "text-red-600" : "text-gray-900"}`}
                        >
                          {formatDate(promoCode.valid_until)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleActive(promoCode.id, promoCode.is_active)}
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full transition-colors ${
                            promoCode.is_active && !isExpired(promoCode.valid_until)
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : "bg-red-100 text-red-800 hover:bg-red-200"
                          }`}
                        >
                          {promoCode.is_active && !isExpired(promoCode.valid_until) ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <Link
                          href={`/admin/promo-codes/${promoCode.id}/edit`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(promoCode.id, promoCode.code)}
                          disabled={deleting === promoCode.id}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        >
                          {deleting === promoCode.id ? "Deleting..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {promoCodes.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No promo codes found</h3>
                <p className="text-gray-500 mb-4">Create your first promo code to offer discounts to customers.</p>
                <Link
                  href="/admin/promo-codes/new"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Create Promo Code
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
