"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, ShoppingCart, MessageSquare } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useCart } from "@/lib/cart-context"
import { ProfileDropdown } from "./profile-dropdown"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAuth()
  const { cart } = useCart()

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">📚</span>
            </div>
            <span className="font-bold text-xl text-primary hidden sm:inline">CampusShelf</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/products" className="text-foreground hover:text-accent font-medium transition">
              Browse
            </Link>
            <Link href="/post-ad" className="text-foreground hover:text-accent font-medium transition">
              Sell
            </Link>
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/chat" className="relative p-2 hover:bg-muted rounded-lg transition">
              <MessageSquare className="w-5 h-5" />
            </Link>

            <Link href="/cart" className="relative p-2 hover:bg-muted rounded-lg transition">
              <ShoppingCart className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 bg-accent text-accent-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Link>

            {user ? (
              <ProfileDropdown />
            ) : (
              <>
                <Link href="/login" className="px-4 py-2 text-primary font-medium hover:bg-muted rounded-lg transition">
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 bg-accent text-accent-foreground font-medium rounded-lg hover:opacity-90 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href="/products" className="block px-4 py-2 hover:bg-muted rounded-lg">
              Browse
            </Link>
            <Link href="/post-ad" className="block px-4 py-2 hover:bg-muted rounded-lg">
              Sell
            </Link>
            <Link href="/chat" className="block px-4 py-2 hover:bg-muted rounded-lg">
              Messages
            </Link>
            <Link href="/cart" className="block px-4 py-2 hover:bg-muted rounded-lg">
              Cart ({cart.length})
            </Link>
            {user ? (
              <>
                <Link href="/profile" className="block px-4 py-2 hover:bg-muted rounded-lg">
                  Profile
                </Link>
                <Link href="/favorites" className="block px-4 py-2 hover:bg-muted rounded-lg">
                  Favorites
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="block px-4 py-2 hover:bg-muted rounded-lg">
                  Login
                </Link>
                <Link href="/signup" className="block px-4 py-2 bg-accent text-accent-foreground rounded-lg">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
