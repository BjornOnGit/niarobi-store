import ProductGrid from "../../components/product/ProductGrid"

// Dummy data to test the component
const dummyProducts = [
  {
    id: "1",
    name: "Hennessy VS",
    description: "Premium cognac with rich flavor and smooth finish",
    price: 45000,
    category: "cognac",
    bottle_size: "750ml",
    image_url: "/placeholder.svg?height=400&width=300",
    slug: "hennessy-vs",
    in_stock: true,
  },
  {
    id: "2",
    name: "Dom Pérignon",
    description: "Luxury champagne for special occasions and celebrations",
    price: 120000,
    category: "champagne",
    bottle_size: "750ml",
    image_url: "/placeholder.svg?height=400&width=300",
    slug: "dom-perignon",
    in_stock: true,
  },
  {
    id: "3",
    name: "Macallan 18",
    description: "Single malt Scotch whisky aged 18 years",
    price: 180000,
    category: "whisky",
    bottle_size: "700ml",
    image_url: "/placeholder.svg?height=400&width=300",
    slug: "macallan-18",
    in_stock: false,
  },
]

export default function TestProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Product Cards Test</h1>
      <ProductGrid products={dummyProducts} />
    </div>
  )
}
