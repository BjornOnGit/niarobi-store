
"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

const CATEGORIES = [
  { value: "", label: "All Categories" },
  { value: "wine", label: "Wine" },
  { value: "whisky", label: "Whisky" },
  { value: "cognac", label: "Cognac" },
  { value: "champagne", label: "Champagne" },
  { value: "vodka", label: "Vodka" },
  { value: "rum", label: "Rum" },
  { value: "gin", label: "Gin" },
]

const PRICE_RANGES = [
  { value: "", label: "All Prices" },
  { value: "0-25000", label: "Under ₦25,000" },
  { value: "25000-50000", label: "₦25,000 - ₦50,000" },
  { value: "50000-100000", label: "₦50,000 - ₦100,000" },
  { value: "100000-200000", label: "₦100,000 - ₦200,000" },
  { value: "200000-999999", label: "Above ₦200,000" },
]

export default function ProductFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [category, setCategory] = useState(searchParams.get("category") || "")
  const [priceRange, setPriceRange] = useState(searchParams.get("price") || "")
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest")

  const updateFilters = (newCategory, newPriceRange, newSortBy) => {
    const params = new URLSearchParams()

    if (newCategory) params.set("category", newCategory)
    if (newPriceRange) params.set("price", newPriceRange)
    if (newSortBy && newSortBy !== "newest") params.set("sort", newSortBy)

    const queryString = params.toString()
    const newUrl = queryString ? `/products?${queryString}` : "/products"

    router.push(newUrl)
  }

  const handleCategoryChange = (value) => {
    setCategory(value)
    updateFilters(value, priceRange, sortBy)
  }

  const handlePriceChange = (value) => {
    setPriceRange(value)
    updateFilters(category, value, sortBy)
  }

  const handleSortChange = (value) => {
    setSortBy(value)
    updateFilters(category, priceRange, value)
  }

  const clearFilters = () => {
    setCategory("")
    setPriceRange("")
    setSortBy("newest")
    router.push("/products")
  }

  const hasActiveFilters = category || priceRange || sortBy !== "newest"

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Category Filter */}
        <div className="flex-1">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range Filter */}
        <div className="flex-1">
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
            Price Range
          </label>
          <select
            id="price"
            value={priceRange}
            onChange={(e) => handlePriceChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {PRICE_RANGES.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div className="flex-1">
          <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <div className="flex-shrink-0">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors mt-6 lg:mt-0"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600">Active filters:</span>
            {category && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {CATEGORIES.find((c) => c.value === category)?.label}
              </span>
            )}
            {priceRange && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {PRICE_RANGES.find((p) => p.value === priceRange)?.label}
              </span>
            )}
            {sortBy !== "newest" && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Sort:{" "}
                {sortBy === "price-low"
                  ? "Price Low-High"
                  : sortBy === "price-high"
                    ? "Price High-Low"
                    : sortBy === "name"
                      ? "A-Z"
                      : "Oldest First"}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
