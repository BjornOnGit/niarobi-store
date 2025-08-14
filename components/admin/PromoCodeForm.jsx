"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import LoadingSpinner from "../../components/ui/LoadingSpinner"

export default function PromoCodeForm({ promoCode = null, isEdit = false }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    code: promoCode?.code || "",
    description: promoCode?.description || "",
    discount_type: promoCode?.discount_type || "percentage",
    discount_value: promoCode?.discount_value || "",
    min_order_amount: promoCode?.min_order_amount || "",
    max_discount_amount: promoCode?.max_discount_amount || "",
    usage_limit: promoCode?.usage_limit || "",
    valid_from: promoCode?.valid_from ? promoCode.valid_from.split("T")[0] : "",
    valid_until: promoCode?.valid_until ? promoCode.valid_until.split("T")[0] : "",
    is_active: promoCode?.is_active ?? true,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let result = ""
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setFormData((prev) => ({ ...prev, code: result }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Validation
    if (!formData.code || !formData.discount_value || !formData.min_order_amount) {
      setError("Please fill in all required fields.")
      setLoading(false)
      return
    }

    const discountValue = Number.parseFloat(formData.discount_value)
    const minOrderAmount = Number.parseFloat(formData.min_order_amount)

    if (isNaN(discountValue) || discountValue <= 0) {
      setError("Please enter a valid discount value.")
      setLoading(false)
      return
    }

    if (isNaN(minOrderAmount) || minOrderAmount < 0) {
      setError("Please enter a valid minimum order amount.")
      setLoading(false)
      return
    }

    if (formData.discount_type === "percentage" && discountValue > 100) {
      setError("Percentage discount cannot exceed 100%.")
      setLoading(false)
      return
    }

    if (formData.valid_until && formData.valid_from && formData.valid_until < formData.valid_from) {
      setError("End date cannot be before start date.")
      setLoading(false)
      return
    }

    try {
      const promoData = {
        ...formData,
        discount_value: discountValue,
        min_order_amount: minOrderAmount,
        max_discount_amount: formData.max_discount_amount ? Number.parseFloat(formData.max_discount_amount) : null,
        usage_limit: formData.usage_limit ? Number.parseInt(formData.usage_limit) : null,
        valid_from: formData.valid_from ? new Date(formData.valid_from).toISOString() : new Date().toISOString(),
        valid_until: formData.valid_until ? new Date(formData.valid_until).toISOString() : null,
      }

      const url = isEdit ? `/api/admin/promo-codes/${promoCode.id}` : "/api/admin/promo-codes"
      const method = isEdit ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(promoData),
      })

      const data = await response.json()

      if (response.ok) {
        router.push("/admin/promo-codes")
      } else {
        setError(data.error || "Failed to save promo code. Please try again.")
      }
    } catch (error) {
      console.error("Error saving promo code:", error)
      setError("Failed to save promo code. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Promo Code */}
        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
            Promo Code *
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              required
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase"
              placeholder="e.g., SAVE20"
              style={{ textTransform: "uppercase" }}
            />
            <button
              type="button"
              onClick={generateCode}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Generate
            </button>
          </div>
        </div>

        {/* Discount Type */}
        <div>
          <label htmlFor="discount_type" className="block text-sm font-medium text-gray-700 mb-2">
            Discount Type *
          </label>
          <select
            id="discount_type"
            name="discount_type"
            value={formData.discount_type}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="percentage">Percentage (%)</option>
            <option value="fixed">Fixed Amount (₦)</option>
          </select>
        </div>

        {/* Discount Value */}
        <div>
          <label htmlFor="discount_value" className="block text-sm font-medium text-gray-700 mb-2">
            Discount Value * {formData.discount_type === "percentage" ? "(%)" : "(₦)"}
          </label>
          <input
            type="number"
            id="discount_value"
            name="discount_value"
            value={formData.discount_value}
            onChange={handleChange}
            required
            min="0"
            max={formData.discount_type === "percentage" ? "100" : undefined}
            step={formData.discount_type === "percentage" ? "0.01" : "1"}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder={formData.discount_type === "percentage" ? "e.g., 20" : "e.g., 5000"}
          />
        </div>

        {/* Min Order Amount */}
        <div>
          <label htmlFor="min_order_amount" className="block text-sm font-medium text-gray-700 mb-2">
            Minimum Order Amount (₦) *
          </label>
          <input
            type="number"
            id="min_order_amount"
            name="min_order_amount"
            value={formData.min_order_amount}
            onChange={handleChange}
            required
            min="0"
            step="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., 10000"
          />
        </div>

        {/* Max Discount Amount (only for percentage) */}
        {formData.discount_type === "percentage" && (
          <div>
            <label htmlFor="max_discount_amount" className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Discount Amount (₦)
            </label>
            <input
              type="number"
              id="max_discount_amount"
              name="max_discount_amount"
              value={formData.max_discount_amount}
              onChange={handleChange}
              min="0"
              step="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 50000"
            />
          </div>
        )}

        {/* Usage Limit */}
        <div>
          <label htmlFor="usage_limit" className="block text-sm font-medium text-gray-700 mb-2">
            Usage Limit
          </label>
          <input
            type="number"
            id="usage_limit"
            name="usage_limit"
            value={formData.usage_limit}
            onChange={handleChange}
            min="1"
            step="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Leave empty for unlimited"
          />
        </div>

        {/* Valid From */}
        <div>
          <label htmlFor="valid_from" className="block text-sm font-medium text-gray-700 mb-2">
            Valid From
          </label>
          <input
            type="date"
            id="valid_from"
            name="valid_from"
            value={formData.valid_from}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Valid Until */}
        <div>
          <label htmlFor="valid_until" className="block text-sm font-medium text-gray-700 mb-2">
            Valid Until
          </label>
          <input
            type="date"
            id="valid_until"
            name="valid_until"
            value={formData.valid_until}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Optional description for internal use..."
        />
      </div>

      {/* Is Active */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="is_active"
          name="is_active"
          checked={formData.is_active}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
          Active (customers can use this promo code)
        </label>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {loading && <LoadingSpinner size="sm" />}
          {loading ? "Saving..." : isEdit ? "Update Promo Code" : "Create Promo Code"}
        </button>
      </div>
    </form>
  )
}
