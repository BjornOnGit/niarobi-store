"use client"

import AdminLayout from "../../../../components/admin/AdminLayout"
import PromoCodeForm from "../../../../components/admin/PromoCodeForm"

export default function NewPromoCodePage() {
  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Create Promo Code</h1>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <PromoCodeForm />
        </div>
      </div>
    </AdminLayout>
  )
}
