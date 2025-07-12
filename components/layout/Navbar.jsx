import Link from "next/link"
import CartIcon from "../ui/CartIcon"

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-gray-900">
            Niarobi
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
            <Link href="/auth" className="text-gray-600 hover:text-gray-900">
              Sign In / Up
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <CartIcon />
          </div>
        </div>
      </div>
    </nav>
  )
}
