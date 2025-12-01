"use client"

import { useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { dummyItems } from "@/lib/dummy-data"
import { ProductCard } from "@/components/product-card"
import { EditProfileModal } from "@/components/edit-profile-modal"
import { useAuth } from "@/lib/auth-context"
import { useSearchParams } from "next/navigation"
import { Edit2 } from "lucide-react"
import { useI18n } from "@/lib/i18n-context"

export default function ProfilePage() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const [isEditModalOpen, setIsEditModalOpen] = useState(searchParams.get("edit") === "true")
  const userListings = dummyItems.slice(0, 4)
  const { t } = useI18n()

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Please log in to view your profile.</p>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Header */}
        <div className="bg-card rounded-lg p-8 border border-border mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center text-accent-foreground font-bold text-3xl">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold">{user.name}</h1>
                <p className="text-muted-foreground">{user.college}</p>
                <p className="text-sm text-muted-foreground mt-1">{user.about}</p>
              </div>
            </div>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition"
            >
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

        {/* My Posts */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{t("profile.myPosts")}</h2>
            <Link href="/post-ad" className="px-4 py-2 bg-accent text-accent-foreground font-semibold rounded-lg hover:opacity-90 transition">
              {t("profile.postNewAd")}
            </Link>
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
          </div>
        </div>
      </main>

      <Footer />

      <EditProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />
    </div>
  )
}






