import "./globals.css"
import { Providers } from "../components/providers" // Import the new Providers component
import Footer from "../components/layout/Footer"

export const metadata = {
  title: "Niarobi Liquor Store  - Premium Spirits Delivered",
  description: "Premium liquor delivery in Lagos and Abuja. Curated selection of wines, spirits, and champagne with fast, secure delivery.",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          <div className="min-h-screen flex flex-col">
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}
