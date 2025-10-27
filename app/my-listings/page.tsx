"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { dummyItems } from "@/lib/dummy-data"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"

export default function MyListingsPage() {
  const { user } = useAuth()
  const userListings = dummyItems.slice(0, 4)

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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">My Listings</h1>
          <Link
            href="/post-ad"
            className="px-6 py-3 bg-accent text-accent-foreground font-semibold rounded-lg hover:opacity-90 transition"
          >
            Post New Ad
          </Link>
        </div>

        {userListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {userListings.map((item) => (
              <ProductCard key={item.id} {...item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg mb-6">You haven't posted any listings yet.</p>
            <Link
              href="/post-ad"
              className="inline-block px-6 py-3 bg-accent text-accent-foreground font-semibold rounded-lg hover:opacity-90 transition"
            >
              Post Your First Ad
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
