"use client"

import { useState, useEffect } from "react"
import AdminLayout from "../../../components/admin/AdminLayout"
import LoadingSpinner from "../../../components/ui/LoadingSpinner"
import AddUserForm from "../../../components/admin/AddUserForm"
import { Plus, MoreVertical, Shield, User, Trash2 } from "lucide-react"

export default function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [makingAdmin, setMakingAdmin] = useState(null)
  const [removingAdmin, setRemovingAdmin] = useState(null)
  const [deletingUser, setDeletingUser] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(null)

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
        fetchUsers()
        alert(`${userEmail} is now an admin!`)
      } else {
        alert("Failed to make user admin. Please try again.")
      }
    } catch (error) {
      console.error("Error making user admin:", error)
      alert("Failed to make user admin. Please try again.")
    } finally {
      setMakingAdmin(null)
      setDropdownOpen(null)
    }
  }

  const removeAdminRole = async (userId, userEmail) => {
    if (!confirm(`Are you sure you want to remove admin role from ${userEmail}?`)) {
      return
    }

    setRemovingAdmin(userId)
    try {
      const response = await fetch(`/api/admin/users/${userId}/remove-admin`, {
        method: "POST",
      })

      if (response.ok) {
        fetchUsers()
        alert(`Admin role removed from ${userEmail}`)
      } else {
        alert("Failed to remove admin role. Please try again.")
      }
    } catch (error) {
      console.error("Error removing admin role:", error)
      alert("Failed to remove admin role. Please try again.")
    } finally {
      setRemovingAdmin(null)
      setDropdownOpen(null)
    }
  }

  const deleteUser = async (userId, userEmail) => {
    if (!confirm(`Are you sure you want to delete user ${userEmail}? This action cannot be undone.`)) {
      return
    }

    setDeletingUser(userId)
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchUsers()
        alert(`User ${userEmail} has been deleted`)
      } else {
        alert("Failed to delete user. Please try again.")
      }
    } catch (error) {
      console.error("Error deleting user:", error)
      alert("Failed to delete user. Please try again.")
    } finally {
      setDeletingUser(null)
      setDropdownOpen(null)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <AdminLayout>
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add New User
          </button>
        </div>

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
                          className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${
                            user.role === "admin" ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {user.role === "admin" ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                          {user.role || "User"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="relative">
                          <button
                            onClick={() => setDropdownOpen(dropdownOpen === user.id ? null : user.id)}
                            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {dropdownOpen === user.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-10">
                              <div className="py-1">
                                {user.role !== "admin" ? (
                                  <button
                                    onClick={() => makeUserAdmin(user.id, user.email)}
                                    disabled={makingAdmin === user.id}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 disabled:opacity-50"
                                  >
                                    <Shield className="w-4 h-4" />
                                    {makingAdmin === user.id ? "Making Admin..." : "Make Admin"}
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => removeAdminRole(user.id, user.email)}
                                    disabled={removingAdmin === user.id}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 disabled:opacity-50"
                                  >
                                    <User className="w-4 h-4" />
                                    {removingAdmin === user.id ? "Removing Admin..." : "Remove Admin"}
                                  </button>
                                )}

                                <button
                                  onClick={() => deleteUser(user.id, user.email)}
                                  disabled={deletingUser === user.id}
                                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 disabled:opacity-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  {deletingUser === user.id ? "Deleting..." : "Delete User"}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {users.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                <p className="text-gray-500">Users will appear here once they sign up or are added.</p>
              </div>
            )}
          </div>
        )}

        {showAddForm && <AddUserForm onUserAdded={fetchUsers} onCancel={() => setShowAddForm(false)} />}
      </div>
    </AdminLayout>
  )
}
