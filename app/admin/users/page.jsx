"use client"

import { useState, useEffect } from "react"
import AdminLayout from "../../../components/admin/AdminLayout"
import LoadingSpinner from "../../../components/ui/LoadingSpinner"

export default function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [makingAdmin, setMakingAdmin] = useState(null)

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users")
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
      }
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  const makeUserAdmin = async (userId, userEmail) => {
    if (!confirm(`Are you sure you want to make ${userEmail} an admin?`)) {
      return
    }

    setMakingAdmin(userId)
    try {
      const response = await fetch(`/api/admin/users/${userId}/make-admin`, {
        method: "POST",
      })

      if (response.ok) {
        // Refresh the users list
        fetchUsers()
      } else {
        alert("Failed to make user admin. Please try again.")
      }
    } catch (error) {
      console.error("Error making user admin:", error)
      alert("Failed to make user admin. Please try again.")
    } finally {
      setMakingAdmin(null)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Users</h1>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.email}</div>
                          <div className="text-sm text-gray-500">ID: {user.id.slice(-8)}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.role === "admin" ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {user.role || "User"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {user.role !== "admin" && (
                          <button
                            onClick={() => makeUserAdmin(user.id, user.email)}
                            disabled={makingAdmin === user.id}
                            className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
                          >
                            {makingAdmin === user.id ? "Making Admin..." : "Make Admin"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {users.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                <p className="text-gray-500">Users will appear here once they sign up.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
