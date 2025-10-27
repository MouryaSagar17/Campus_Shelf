"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { dummyItems } from "@/lib/dummy-data"
import { ProductCard } from "@/components/product-card"
import { Edit2, LogOut } from "lucide-react"

export default function ProfilePage() {
  const userListings = dummyItems.slice(0, 4)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Header */}
        <div className="bg-card rounded-lg p-8 border border-border mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center text-accent-foreground font-bold text-3xl">
                RK
              </div>
              <div>
                <h1 className="text-3xl font-bold">Raj Kumar</h1>
                <p className="text-muted-foreground">Member since January 2023</p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition">
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-accent">24</p>
              <p className="text-sm text-muted-foreground">Items Sold</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-accent">4.8</p>
              <p className="text-sm text-muted-foreground">Rating</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-accent">95%</p>
              <p className="text-sm text-muted-foreground">Response Rate</p>
            </div>
          </div>
        </div>

        {/* My Listings */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">My Listings</h2>
            <button className="px-4 py-2 bg-accent text-accent-foreground font-semibold rounded-lg hover:opacity-90 transition">
              Post New Ad
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {userListings.map((item) => (
              <ProductCard key={item.id} {...item} />
            ))}
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-card rounded-lg p-8 border border-border">
          <h2 className="text-xl font-bold mb-6">Account Settings</h2>
          <div className="space-y-4">
            <button className="w-full text-left px-4 py-3 hover:bg-muted rounded-lg transition">Change Password</button>
            <button className="w-full text-left px-4 py-3 hover:bg-muted rounded-lg transition">
              Notification Preferences
            </button>
            <button className="w-full text-left px-4 py-3 hover:bg-muted rounded-lg transition">
              Privacy Settings
            </button>
            <button className="w-full text-left px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg transition flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
