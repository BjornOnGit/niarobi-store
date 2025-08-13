"use client"

import { useUserSession } from "../../context/UserSessionContext"
import Navbar from "../../components/layout/Navbar"
import LoadingSpinner from "../../components/ui/LoadingSpinner"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AccountPage() {
  const { user, loading, signOut } = useUserSession()
  const router = useRouter()

  useEffect(() => {
    // Redirect to auth page if not logged in and not loading
    if (!loading && !user) {
      router.push("/auth")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </>
    )
  }

  if (!user) {
    // This case should ideally be handled by the redirect in useEffect,
    // but as a fallback or during initial render before redirect
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center p-8 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
            <p className="text-gray-600 mb-6">Please sign in to view your account details.</p>
            <button
              onClick={() => router.push("/auth")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Sign In / Sign Up
            </button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">My Account</h1>

          <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Profile Information</h2>
              <p className="text-gray-700">
                <span className="font-medium">Email:</span> {user.email}
              </p>
              {user.created_at && (
                <p className="text-gray-700">
                  <span className="font-medium">Member Since:</span> {new Date(user.created_at).toLocaleDateString()}
                </p>
              )}
              {/* Add more user details here as needed, e.g., user_metadata */}
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Account Actions</h2>
              <button
                onClick={signOut}
                className="w-full bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
