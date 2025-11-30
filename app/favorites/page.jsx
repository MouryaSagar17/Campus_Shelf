"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { dummyItems } from "@/lib/dummy-data"
import { useFavorites } from "@/lib/favorites-context"
import { Heart } from "lucide-react"
import Link from "next/link"

export default function FavoritesPage() {
  const { favorites } = useFavorites()
  const [favoriteItems, setFavoriteItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (favorites.length === 0) {
      setFavoriteItems([])
      setLoading(false)
      return
    }

    async function loadFavorites() {
      try {
        // Fetch all listings from API
        const res = await fetch("/api/listings?limit=1000", { cache: "no-store" })
        const json = await res.json()
        
        if (json.ok) {
          // Map API listings to match ProductCard format
          const apiItems = json.data
            .filter((it) => favorites.includes(String(it._id)))
            .map((it) => ({
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

          // Also check dummy items for any favorites
          const dummyFavorites = dummyItems.filter((item) => favorites.includes(String(item.id)))
          
          // Combine and remove duplicates
          const allFavorites = [...apiItems, ...dummyFavorites]
          const uniqueFavorites = allFavorites.filter((item, index, self) =>
            index === self.findIndex((t) => String(t.id) === String(item.id))
          )
          
          setFavoriteItems(uniqueFavorites)
        } else {
          // Fallback to dummy items
          const dummyFavorites = dummyItems.filter((item) => favorites.includes(String(item.id)))
          setFavoriteItems(dummyFavorites)
        }
      } catch (err) {
        console.error("Failed to load favorites:", err)
        // Fallback to dummy items
        const dummyFavorites = dummyItems.filter((item) => favorites.includes(String(item.id)))
        setFavoriteItems(dummyFavorites)
      } finally {
        setLoading(false)
      }
    }

    loadFavorites()
  }, [favorites])

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
            {loading ? "Loading..." : `${favoriteItems.length} item${favoriteItems.length !== 1 ? "s" : ""} saved`}
          </p>
        </div>

        {/* Favorites Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="text-muted-foreground">Loading favorites...</div>
          </div>
        ) : favoriteItems.length > 0 ? (
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






