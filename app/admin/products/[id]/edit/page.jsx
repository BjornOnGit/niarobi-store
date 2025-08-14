"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import AdminLayout from "../../../../../components/admin/AdminLayout"
import ProductForm from "../../../../../components/admin/ProductForm"
import LoadingSpinner from "../../../../../components/ui/LoadingSpinner"

export default function EditProductPage() {
  const params = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/admin/products/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setProduct(data.product)
        } else {
          setError("Product not found")
        }
      } catch (error) {
        console.error("Error fetching product:", error)
        setError("Failed to load product")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchProduct()
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

  if (error || !product) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-6">{error || "The product you're looking for doesn't exist."}</p>
          <a
            href="/admin/products"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Back to Products
          </a>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Product</h1>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <ProductForm product={product} isEdit={true} />
        </div>
      </div>
    </AdminLayout>
  )
}
