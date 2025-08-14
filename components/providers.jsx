"use client"

import { CartProvider } from "../context/CartContext"
import { UserSessionProvider } from "../context/UserSessionContext"
import { AdminProvider } from "../context/AdminContext"

export function Providers({ children }) {
  return (
    <UserSessionProvider>
      <AdminProvider>
        <CartProvider>{children}</CartProvider>
      </AdminProvider>
    </UserSessionProvider>
  )
}
