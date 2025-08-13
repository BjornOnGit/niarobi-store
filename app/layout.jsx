import "./globals.css"
import { Providers } from "../components/providers" // Import the new Providers component

export const metadata = {
  title: "Niarobi Liquor Store",
  description: "Premium liquor delivery in Lagos and Abuja",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>{children}</Providers> {/* Use the new Providers component */}
      </body>
    </html>
  )
}
