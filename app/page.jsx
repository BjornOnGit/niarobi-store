import Link from "next/link"
import Navbar from "../components/layout/Navbar"
import Image from "next/image"

export default function HomePage() {
  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0 opacity-40 pointer-events-none">
              <svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
                <g fill="none" fillRule="evenodd">
                  <g fill="#ffffff" fillOpacity="0.05">
                    <circle cx="30" cy="30" r="2" />
                  </g>
                </g>
              </svg>
            </div>
          
          <div className="relative container mx-auto px-4 py-20 lg:py-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-full border border-amber-500/30 mb-6">
                  <span className="text-amber-300 text-sm font-medium">🥂 Premium Collection</span>
                </div>
                <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-300 bg-clip-text text-transparent">
                    Niarobi
                  </span>
                  <br />
                  <span className="text-white">Liquor Store</span>
                </h1>
                
                <p className="text-xl lg:text-2xl text-gray-300 mb-8 leading-relaxed">
                  Premium spirits delivered to your doorstep in 
                  <span className="text-amber-300 font-semibold"> Lagos & Abuja</span>
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link
                    href="/products"
                    className="group relative px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl shadow-2xl hover:shadow-amber-500/25 transform hover:scale-105 transition-all duration-300"
                  >
                    <span className="relative z-10">Shop Premium Collection</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                  
                  <Link
                    href="/order-lookup"
                    className="px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 hover:border-white/50 transition-all duration-300"
                  >
                    Track Your Order
                  </Link>
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-white/20">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-amber-300">500+</div>
                    <div className="text-gray-400 text-sm">Premium Bottles</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-amber-300">24h</div>
                    <div className="text-gray-400 text-sm">Fast Delivery</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-amber-300">100%</div>
                    <div className="text-gray-400 text-sm">Authentic</div>
                  </div>
                </div>
              </div>
              
              {/* Right Content - Hero Image */}
              <div className="relative">
                <div className="relative z-10">
                  <div className="relative w-full h-96 lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl">
                    <Image
                      src="/luxury-wine-display.png"
                      alt="Premium Liquor Collection"
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                  </div>
                  
                  {/* Floating Cards */}
                  <div className="absolute -top-4 -left-4 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">🏆</span>
                      </div>
                      <div>
                        <div className="text-white font-semibold">Premium Quality</div>
                        <div className="text-gray-300 text-sm">Curated Selection</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute -bottom-4 -right-4 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">🚚</span>
                      </div>
                      <div>
                        <div className="text-white font-semibold">Fast Delivery</div>
                        <div className="text-gray-300 text-sm">Same Day Available</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Background Decoration */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-2xl blur-3xl transform rotate-6 scale-110"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Features Section */}
        <div className="relative py-20 bg-white/5 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">Why Choose Niarobi?</h2>
              <p className="text-xl text-gray-300">Experience luxury liquor shopping like never before</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: "🍷",
                  title: "Premium Selection",
                  description: "Carefully curated collection of the world's finest spirits and wines"
                },
                {
                  icon: "🚀",
                  title: "Lightning Fast",
                  description: "Same-day delivery available in Lagos and Abuja metropolitan areas"
                },
                {
                  icon: "🔒",
                  title: "Secure & Safe",
                  description: "Age verification required. Secure payments with Paystack integration"
                }
              ].map((feature, index) => (
                <div key={index} className="group text-center p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 hover:transform hover:scale-105">
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
