"use client"

import { useState } from "react"
import { supabase } from "../../lib/supabase/client" // Use the client-side Supabase instance
import { useRouter } from "next/navigation"
import Navbar from "../../components/layout/Navbar"
import LoadingSpinner from "../../components/ui/LoadingSpinner"

export default function AuthPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSigningUp, setIsSigningUp] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState("") // 'success' or 'error'

  const router = useRouter()

  const handleSignUp = async (e) => {
    e.preventDefault()
    setMessage("")
    setMessageType("")
    setIsLoading(true)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`, // For email confirmation flow
      },
    })

    if (error) {
      setMessage(error.message)
      setMessageType("error")
    } else {
      setMessage("Check your email for a confirmation link to complete your sign up!")
      setMessageType("success")
      setEmail("")
      setPassword("")
    }
    setIsLoading(false)
  }

  const handleSignIn = async (e) => {
    e.preventDefault()
    setMessage("")
    setMessageType("")
    setIsLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setMessage(error.message)
      setMessageType("error")
    } else {
      setMessage("Signed in successfully! Redirecting...")
      setMessageType("success")
      router.push("/products") // Redirect to products page after successful sign-in
    }
    setIsLoading(false)
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-lg shadow-lg">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
              {isSigningUp ? "Create your account" : "Sign in to your account"}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Or{" "}
              <button
                onClick={() => setIsSigningUp(!isSigningUp)}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                {isSigningUp ? "sign in to an existing account" : "create a new account"}
              </button>
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={isSigningUp ? handleSignUp : handleSignIn}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
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

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? <LoadingSpinner size="sm" /> : isSigningUp ? "Sign up" : "Sign in"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
