"use client"

import { useEffect, useMemo, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { SearchBar } from "@/components/search-bar"
import { dummyItems, categories, colleges } from "@/lib/dummy-data"
import { Filter } from "lucide-react"

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedCollege, setSelectedCollege] = useState("All Colleges")
  const [sortBy, setSortBy] = useState("newest")
  const [serverItems, setServerItems] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false
    async function load() {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        if (searchQuery) params.set("q", searchQuery)
        if (selectedCategory && selectedCategory !== "All") params.set("category", selectedCategory)
        if (selectedCollege && selectedCollege !== "All Colleges") params.set("college", selectedCollege)
        if (sortBy === "price-low") params.set("sort", "price")
        else if (sortBy === "price-high") params.set("sort", "-price")
        else if (sortBy === "rating") params.set("sort", "-rating")
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
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    load()
    return () => {
      ignore = true
    }
  }, [searchQuery, selectedCategory, selectedCollege, sortBy])

  const itemsSource = serverItems ?? dummyItems

  const filteredItems = useMemo(() => {
    const usingServerResults = Boolean(serverItems)
    const items = itemsSource.filter((item) => {
      const matchesSearch = usingServerResults
        ? true // server already applied q filter
        : (item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           item.category.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory
      const matchesCollege = selectedCollege === "All Colleges" || item.college === selectedCollege
      return matchesSearch && matchesCategory && matchesCollege
    })

    if (sortBy === "price-low") {
      items.sort((a, b) => a.price - b.price)
    } else if (sortBy === "price-high") {
      items.sort((a, b) => b.price - a.price)
    } else if (sortBy === "rating") {
      items.sort((a, b) => b.rating - a.rating)
    }

    return items
  }, [itemsSource, searchQuery, selectedCategory, selectedCollege, sortBy])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Browse All Items</h1>
          <p className="text-muted-foreground">{loading ? "Loading..." : `Found ${filteredItems.length} items`}</p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <SearchBar onSearch={setSearchQuery} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg p-6 border border-border sticky top-20">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5" />
                <h2 className="font-bold text-lg">Filters</h2>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-3">College</h3>
                <select
                  value={selectedCollege}
                  onChange={(e) => setSelectedCollege(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  {colleges.map((college) => (
                    <option key={college} value={college}>
                      {college}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Category</h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <label key={cat} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        value={cat}
                        checked={selectedCategory === cat}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort Filter */}
              <div>
                <h3 className="font-semibold mb-3">Sort By</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <ProductCard key={item.id} {...item} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No items found matching your filters.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}



