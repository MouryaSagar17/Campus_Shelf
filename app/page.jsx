"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { SearchBar } from "@/components/search-bar"

import { dummyItems, categories } from "@/lib/dummy-data"
import { useLocation } from "@/lib/location-context"
import { ChevronRight } from "lucide-react"

export default function HomePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const { selectedCity, setSelectedCity } = useLocation()
  const [serverItems, setServerItems] = useState(null)

  const handleSearchSubmit = (query) => {
    const params = new URLSearchParams()
    if (query) params.set("q", query)
    if (selectedCategory && selectedCategory !== "All") params.set("category", selectedCategory)
    router.push(`/products${params.toString() ? `?${params.toString()}` : ""}`)
  }

  useEffect(() => {
    let ignore = false
    async function load() {
      try {
        const params = new URLSearchParams()
        if (searchQuery) params.set("q", searchQuery)
        if (selectedCategory && selectedCategory !== "All") params.set("category", selectedCategory)
        if (selectedCity && selectedCity !== "All Colleges") params.set("college", selectedCity)
        const url = `/api/listings${params.toString() ? `?${params.toString()}` : ""}`
        const res = await fetch(url, { cache: "no-store" })
        const json = await res.json()
        if (!ignore && json.ok) {
          const mapped = json.data.map((it) => ({
            id: it._id,
            title: it.title,
            category: it.category,
            price: it.price,
            originalPrice: it.originalPrice,
            image: it.image || (it.images?.[0] ?? "/placeholder.svg"),
            college: it.college,
            seller: it.seller,
            sellerId: it.sellerId,
            description: it.description,
            rating: it.rating ?? 0,
            reviews: it.reviews ?? 0,
            quantity: it.quantity ?? 1,
            postedAt: it.postedAt ? new Date(it.postedAt) : new Date(it.createdAt || Date.now()),
            images: (it.images && it.images.length > 0) ? it.images : ["/placeholder.svg"],
          }))
          setServerItems(mapped)
        } else if (!ignore) {
          setServerItems(null)
        }
      } catch {
        if (!ignore) setServerItems(null)
      }
    }
    load()
    return () => {
      ignore = true
    }
  }, [searchQuery, selectedCategory, selectedCity])

  const itemsSource = (serverItems && serverItems.length > 0) ? serverItems : dummyItems

  const filteredItems = useMemo(() => {
    const usingServerResults = Boolean(serverItems)
    return itemsSource.filter((item) => {
      const q = searchQuery.toLowerCase()
      const matchesSearch = usingServerResults
        ? true // server already applied q filter
        : (item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q))
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory
      const matchesLocation = selectedCity === "All Colleges" || item.college.toLowerCase().includes(selectedCity.toLowerCase())
      return matchesSearch && matchesCategory && matchesLocation
    })
  }, [itemsSource, searchQuery, selectedCategory, selectedCity, serverItems])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-accent text-accent-foreground py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Buy & Sell Student Materials</h1>
            <p className="text-lg opacity-90 mb-8">Find the best notes and books from your college community</p>
          </div>
          <div className="max-w-4xl mx-auto space-y-4">
            <SearchBar onSearch={setSearchQuery} onSubmit={handleSearchSubmit} />
          </div>
        </div>
      </section>



      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">


        {/* Items Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {selectedCategory === "All" ? "Latest Listings" : `${selectedCategory}`}
            </h2>
            <Link href="/products" className="flex items-center gap-2 text-accent hover:underline font-medium">
              View All <span className="inline-block"><ChevronRight className="w-4 h-4" /></span>
            </Link>
          </div>

          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <ProductCard key={item.id} {...item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No items found matching your search.</p>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <section className="bg-accent/10 border-2 border-accent rounded-lg p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Have something to sell?</h2>
          <p className="text-foreground/80 mb-6 max-w-2xl mx-auto">
            Post your notes or books for free and reach thousands of students looking for study materials.
          </p>
          <Link
            href="/post-ad"
            className="inline-block px-8 py-3 bg-accent text-accent-foreground font-bold rounded-lg hover:opacity-90 transition"
          >
            Post Your First Ad
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  )
}



