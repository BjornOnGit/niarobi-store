"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { supabase } from "../lib/supabase/client" // Use the client-side Supabase instance

const UserSessionContext = createContext()

export function UserSessionProvider({ children }) {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      setSession(currentSession)
      setUser(currentSession?.user || null)
      setLoading(false)
    })

    // Initial session check
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession)
      setUser(initialSession?.user || null)
      setLoading(false)
    })

    // Cleanup function: unsubscribe from the listener when the component unmounts
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe()
      }
    }
  }, [])

  const value = {
    session,
    user,
    loading,
    signIn: supabase.auth.signInWithPassword,
    signUp: supabase.auth.signUp,
    signOut: supabase.auth.signOut,
  }

  return <UserSessionContext.Provider value={value}>{children}</UserSessionContext.Provider>
}

export function useUserSession() {
  const context = useContext(UserSessionContext)
  if (!context) {
    throw new Error("useUserSession must be used within a UserSessionProvider")
  }
  return context
}
