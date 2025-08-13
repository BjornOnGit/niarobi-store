"use client"

import { CartProvider } from "../context/CartContext"
import { UserSessionProvider } from "../context/UserSessionContext"

export function Providers({ children }) {
  return (
    <UserSessionProvider>
      <CartProvider>{children}</CartProvider>
    </UserSessionProvider>
  )
}
