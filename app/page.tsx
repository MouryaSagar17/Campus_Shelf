"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { SearchBar } from "@/components/search-bar"
import { LocationSearchBar } from "@/components/location-search-bar"
import { CategoriesSection } from "@/components/categories-section"
import { dummyItems } from "@/lib/dummy-data"
import { ChevronRight } from "lucide-react"

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedLocation, setSelectedLocation] = useState("All Colleges")

  const filteredItems = useMemo(() => {
    return dummyItems.filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory
      const matchesLocation = selectedLocation === "All Colleges" || item.college === selectedLocation
      return matchesSearch && matchesCategory && matchesLocation
    })
  }, [searchQuery, selectedCategory, selectedLocation])

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-white py-8 md:py-12 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">Buy & Sell Student Materials</h1>
            <p className="text-gray-600 mb-6">Find the best notes and books from your college community</p>
          </div>
          <div className="max-w-4xl mx-auto space-y-4">
            <SearchBar onSearch={setSearchQuery} />
            <div className="flex flex-col sm:flex-row gap-3">
              <LocationSearchBar onLocationSelect={setSelectedLocation} selectedLocation={selectedLocation} />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <CategoriesSection />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        {/* Items Grid - 4 columns like OLX */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Fresh recommendations</h2>
            <Link href="/products" className="flex items-center gap-2 text-accent hover:underline font-medium">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredItems.slice(0, 8).map((item) => (
                <ProductCard key={item.id} {...item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No items found matching your search.</p>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <section className="bg-blue-600 rounded-lg p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Want to see your stuff here?</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Make some extra cash by selling things in your community. Go on, it's quick and easy.
          </p>
          <Link
            href="/post-ad"
            className="inline-block px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition"
          >
            Start selling
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  )
}
