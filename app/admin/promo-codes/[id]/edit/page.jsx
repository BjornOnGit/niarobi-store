"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import AdminLayout from "../../../../../components/admin/AdminLayout"
import PromoCodeForm from "../../../../../components/admin/PromoCodeForm"
import LoadingSpinner from "../../../../../components/ui/LoadingSpinner"

export default function EditPromoCodePage() {
  const params = useParams()
  const [promoCode, setPromoCode] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchPromoCode = async () => {
      try {
        const response = await fetch(`/api/admin/promo-codes/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setPromoCode(data.promoCode)
        } else {
          setError("Promo code not found")
        }
      } catch (error) {
        console.error("Error fetching promo code:", error)
        setError("Failed to load promo code")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchPromoCode()
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

  if (error || !promoCode) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Promo Code Not Found</h2>
          <p className="text-gray-600 mb-6">{error || "The promo code you're looking for doesn't exist."}</p>
          <a
            href="/admin/promo-codes"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Back to Promo Codes
          </a>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Promo Code</h1>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <PromoCodeForm promoCode={promoCode} isEdit={true} />
        </div>
      </div>
    </AdminLayout>
  )
}
