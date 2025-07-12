import "./globals.css"
import { CartProvider } from "../context/CartContext"

export const metadata = {
  title: "Niarobi Liquor Store",
  description: "Premium liquor delivery in Lagos and Abuja",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  )
}
