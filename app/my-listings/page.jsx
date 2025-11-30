"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import { Edit, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function MyListingsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }
    loadListings()
  }, [user])

  const loadListings = async () => {
    try {
      const res = await fetch("/api/listings", { cache: "no-store" })
      const json = await res.json()
      if (json.ok) {
        // Filter listings by current user (you may need to adjust this based on your auth setup)
        const userListings = json.data.map((it) => ({
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
          ownerId: it.ownerId,
        }))
        setListings(userListings)
      }
    } catch (err) {
      console.error("Failed to load listings:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this listing?")) return
    
    setDeleting(id)
    try {
      const res = await fetch(`/api/listings/${id}`, { method: "DELETE" })
      const json = await res.json()
      if (json.ok) {
        setListings((prev) => prev.filter((item) => item.id !== id))
      } else {
        alert("Failed to delete listing: " + (json.error || "Unknown error"))
      }
    } catch (err) {
      alert("Failed to delete listing")
    } finally {
      setDeleting(null)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Please log in to view your listings.</p>
        </main>
        <Footer />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground">Loading your listings...</div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">My Listings</h1>
          <Link href="/post-ad" className="px-6 py-3 bg-accent text-accent-foreground font-semibold rounded-lg hover:opacity-90 transition">
            Post New Ad
          </Link>
        </div>

        {listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {listings.map((item) => (
              <div key={item.id} className="relative group">
                <ProductCard {...item} />
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link
                    href={`/edit-listing/${item.id}`}
                    className="p-2 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition"
                    title="Edit listing"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={deleting === item.id}
                    className="p-2 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition disabled:opacity-50"
                    title="Delete listing"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg mb-6">You haven't posted any listings yet.</p>
            <Link href="/post-ad" className="inline-block px-6 py-3 bg-accent text-accent-foreground font-semibold rounded-lg hover:opacity-90 transition">
              Post Your First Ad
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}






