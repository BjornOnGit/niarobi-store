"use client"

import { useAdmin } from "../../context/AdminContext"
import { useUserSession } from "../../context/UserSessionContext"
import LoadingSpinner from "../../components/ui/LoadingSpinner"
import ErrorBoundary from "../../components/admin/ErrorBoundary"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"

export default function AdminLayout({ children }) {
  const { isAdmin, loading: adminLoading } = useAdmin()
  const { user, loading: userLoading } = useUserSession()
  const router = useRouter()
  const pathname = usePathname()

  if (userLoading || adminLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!user) {
    router.push("/auth")
    return null
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">You don't have permission to access the admin dashboard.</p>
          <Link
            href="/products"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Go to Products
          </Link>
        </div>
      </div>
    )
  }

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: "📊" },
    { name: "Products", href: "/admin/products", icon: "🍷" },
    { name: "Orders", href: "/admin/orders", icon: "📦" },
    { name: "Users", href: "/admin/users", icon: "👥" },
    { name: "Promo Codes", href: "/admin/promo-codes", icon: "🎫" },
    { name: "Analytics", href: "/admin/analytics", icon: "📈" },
  ]

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        {/* Admin Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Link href="/admin" className="text-xl font-bold text-gray-900">
                  Novadora Admin
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Welcome, {user.email}</span>
                <Link href="/products" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  View Store
                </Link>
              </div>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Sidebar */}
          <nav className="w-64 bg-white shadow-sm min-h-screen">
            <div className="p-4">
              <ul className="space-y-2">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                          isActive ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        <span className="mr-3">{item.icon}</span>
                        {item.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          </nav>

          {/* Main Content */}
          <main className="flex-1 p-8">
            <ErrorBoundary>{children}</ErrorBoundary>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  )
}
