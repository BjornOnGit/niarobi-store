"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useUserSession } from "./UserSessionContext"
import { supabase } from "../lib/supabase/client"

const AdminContext = createContext()

export function AdminProvider({ children }) {
  const { user, loading: userLoading } = useUserSession()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (userLoading) return

      if (!user) {
        setIsAdmin(false)
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .eq("role", "admin")
          .single()

        if (error && error.code !== "PGRST116") {
          console.error("Error checking admin status:", error)
          setIsAdmin(false)
        } else {
          setIsAdmin(!!data)
        }
      } catch (error) {
        console.error("Error checking admin status:", error)
        setIsAdmin(false)
      } finally {
        setLoading(false)
      }
    }

    checkAdminStatus()
  }, [user, userLoading])

  const value = {
    isAdmin,
    loading,
  }

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider")
  }
  return context
}
