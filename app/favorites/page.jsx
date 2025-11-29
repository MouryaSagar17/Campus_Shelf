"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { dummyItems } from "@/lib/dummy-data"
import { useFavorites } from "@/lib/favorites-context"
import { Heart } from "lucide-react"
import Link from "next/link"

export default function FavoritesPage() {
  const { favorites } = useFavorites()

  const favoriteItems = dummyItems.filter((item) => favorites.includes(String(item.id)))

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-8 h-8 fill-red-500 text-red-500" />
            <h1 className="text-4xl font-bold">My Favorites</h1>
          </div>
          <p className="text-muted-foreground">
            {favoriteItems.length} item{favoriteItems.length !== 1 ? "s" : ""} saved
          </p>
        </div>

        {/* Favorites Grid */}
        {favoriteItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {favoriteItems.map((item) => (
              <ProductCard key={item.id} {...item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h2 className="text-2xl font-bold mb-2">No favorites yet</h2>
            <p className="text-muted-foreground mb-6">
              Start adding items to your favorites by clicking the heart icon on product cards.
            </p>
            <Link href="/products" className="inline-block px-6 py-3 bg-accent text-accent-foreground font-semibold rounded-lg hover:opacity-90 transition">
              Browse Products
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}






