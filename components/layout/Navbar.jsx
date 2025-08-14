"use client" // Make Navbar a client component to use hooks

import Link from "next/link"
import CartIcon from "../ui/CartIcon"
import SearchBar from "../ui/SearchBar" // Import SearchBar
import { useUserSession } from "../../context/UserSessionContext" // Import useUserSession
import { useRouter } from "next/navigation"

export default function Navbar() {
  const { user, signOut } = useUserSession()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push("/") // Redirect to homepage after logout
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-gray-900">
            Novadora
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/home" className="text-gray-600 hover:text-gray-900">
              Home
            </Link>
            <Link href="/products" className="text-gray-600 hover:text-gray-900">
              Products
            </Link>
            <Link href="/order-lookup" className="text-gray-600 hover:text-gray-900">
              Order Lookup
            </Link>
            {user ? (
              <>
                <Link href="/account" className="text-gray-600 hover:text-gray-900">
                  My Account
                </Link>
                <button onClick={handleSignOut} className="text-gray-600 hover:text-gray-900">
                  Sign Out
                </button>
              </>
            ) : (
              <Link href="/auth" className="text-gray-600 hover:text-gray-900">
                Sign In / Up
              </Link>
            )}
          </div>

          {/* Search Bar */}
          <div className="flex items-center space-x-4">
            <SearchBar />
            <CartIcon />
          </div>
        </div>
      </div>
    </nav>
  )
}
