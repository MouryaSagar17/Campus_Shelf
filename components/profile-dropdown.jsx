"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { User, Heart, ShoppingBag, MessageSquare, HelpCircle, Globe, LogOut } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

export function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [language, setLanguage] = useState("English")
  const dropdownRef = useRef(null)
  const { user, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    setIsOpen(false)
    router.push("/")
  }

  if (!user) return null

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 hover:bg-muted rounded-lg transition"
      >
        <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-accent-foreground font-bold text-sm">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <span className="hidden sm:inline text-sm font-medium">{user.name}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-lg z-50">
          {/* User Info */}
          <div className="p-4 border-b border-border">
            <p className="font-semibold text-foreground">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
            <p className="text-xs text-muted-foreground">{user.college}</p>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 hover:bg-muted transition text-foreground"
            >
              <User className="w-4 h-4" />
              <span className="text-sm">View Profile</span>
            </Link>

            <Link
              href="/profile?edit=true"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 hover:bg-muted transition text-foreground"
            >
              <User className="w-4 h-4" />
              <span className="text-sm">Edit Profile</span>
            </Link>

            <Link
              href="/favorites"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 hover:bg-muted transition text-foreground"
            >
              <Heart className="w-4 h-4" />
              <span className="text-sm">Favorites</span>
            </Link>

            <Link
              href="/my-listings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 hover:bg-muted transition text-foreground"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="text-sm">My Listings</span>
            </Link>

            <Link
              href="/chat"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 hover:bg-muted transition text-foreground"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm">Messages</span>
            </Link>

            <Link
              href="/help"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 hover:bg-muted transition text-foreground"
            >
              <HelpCircle className="w-4 h-4" />
              <span className="text-sm">Help</span>
            </Link>

            {/* Language Selector */}
            <div className="px-4 py-2 border-t border-border">
              <div className="flex items-center gap-3 mb-2">
                <Globe className="w-4 h-4" />
                <span className="text-sm font-medium">Language</span>
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-2 py-1 text-sm border border-border rounded bg-background text-foreground"
              >
                <option>English</option>
                <option>Hindi</option>
                <option>Telugu</option>
                <option>Tamil</option>
              </select>
            </div>
          </div>

          {/* Logout Button */}
          <div className="border-t border-border p-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 text-red-600 rounded transition text-sm font-medium"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}




