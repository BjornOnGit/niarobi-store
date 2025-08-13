"use client"

import Link from "next/link"

import { useState } from "react"
import { useUserSession } from "../../context/UserSessionContext"
import LoadingSpinner from "../ui/LoadingSpinner"

export default function ReviewForm({ productId, onReviewSubmitted }) {
  const { user, loading: userLoading } = useUserSession()
  const [rating, setRating] = useState(0)
  const [reviewText, setReviewText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState("") // 'success' or 'error'

  const handleRatingChange = (newRating) => {
    setRating(newRating)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage("")
    setMessageType("")

    if (!user) {
      setMessage("You must be logged in to submit a review.")
      setMessageType("error")
      return
    }

    if (rating === 0) {
      setMessage("Please select a rating (1-5 stars).")
      setMessageType("error")
      return
    }

    setIsSubmitting(true)

    try {
      // In the next step, we will replace this with an actual API call
      // For now, simulate a submission
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simulate success
      setMessage("Review submitted successfully! (Simulated)")
      setMessageType("success")
      setRating(0)
      setReviewText("")
      onReviewSubmitted && onReviewSubmitted() // Notify parent component
    } catch (error) {
      console.error("Error submitting review:", error)
      setMessage("Failed to submit review. Please try again.")
      setMessageType("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (userLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <LoadingSpinner size="md" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="bg-gray-100 p-4 rounded-lg text-center text-gray-700">
        <p>
          Please{" "}
          <Link href="/auth" className="text-blue-600 hover:underline">
            sign in
          </Link>{" "}
          to leave a review.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Leave a Review</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating Stars */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingChange(star)}
                className={`text-3xl ${
                  star <= rating ? "text-yellow-500" : "text-gray-300"
                } hover:text-yellow-400 transition-colors`}
                aria-label={`${star} star${star > 1 ? "s" : ""}`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        {/* Review Text */}
        <div>
          <label htmlFor="review-text" className="block text-sm font-medium text-gray-700 mb-2">
            Your Review
          </label>
          <textarea
            id="review-text"
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Share your thoughts on this product..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            disabled={isSubmitting}
          ></textarea>
        </div>

        {message && (
          <div
            className={`p-3 rounded-md text-sm ${
              messageType === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
            }`}
          >
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || rating === 0}
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <LoadingSpinner size="sm" /> Submitting...
            </>
          ) : (
            "Submit Review"
          )}
        </button>
      </form>
    </div>
  )
}
