import Link from "next/link"
import Navbar from "../components/layout/Navbar"

export default function HomePage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Novadora</h1>
            <p className="text-xl text-gray-600 mb-8">Premium liquor delivery in Lagos and Abuja</p>
            <Link
              href="/home"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Enter Store
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
