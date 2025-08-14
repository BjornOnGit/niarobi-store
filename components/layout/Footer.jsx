import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">N</span>
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-300 bg-clip-text text-transparent">
                Niarobi
              </span>
            </div>
            <p className="text-gray-300 leading-relaxed mb-6 max-w-md">
              Premium liquor delivery service bringing the world's finest spirits and wines directly to your doorstep in
              Lagos and Abuja.
            </p>
            <div className="flex space-x-4">
              {["facebook", "twitter", "instagram", "linkedin"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-amber-500 transition-all duration-300 hover:scale-110"
                >
                  <span className="text-sm font-bold capitalize">{social[0]}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-amber-300">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { name: "Home", href: "/" },
                { name: "Products", href: "/products" },
                { name: "Track Order", href: "/order-lookup" },
                { name: "My Account", href: "/account" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-amber-300 transition-colors duration-200 hover:translate-x-1 transform inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-amber-300">Support</h3>
            <ul className="space-y-3">
              <li>
                <a href="tel:+234" className="text-gray-300 hover:text-amber-300 transition-colors duration-200">
                  📞 +234 (0) 123 456 789
                </a>
              </li>
              <li>
                <a
                  href="mailto:support@niarobi.com"
                  className="text-gray-300 hover:text-amber-300 transition-colors duration-200"
                >
                  ✉️ support@niarobi.com
                </a>
              </li>
              <li className="text-gray-300">🕒 Mon - Sat: 9AM - 10PM</li>
              <li className="text-gray-300">📍 Lagos & Abuja, Nigeria</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© 2025 Niarobi Liquor Store. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#" className="text-gray-400 hover:text-amber-300 text-sm transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link href="#" className="text-gray-400 hover:text-amber-300 text-sm transition-colors duration-200">
              Terms of Service
            </Link>
            <Link href="#" className="text-gray-400 hover:text-amber-300 text-sm transition-colors duration-200">
              Age Verification
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
