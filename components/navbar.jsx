"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, ShoppingCart, MessageSquare, MapPin } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useCart } from "@/lib/cart-context"
import { useLocation } from "@/lib/location-context"
import { ProfileDropdown } from "./profile-dropdown"
import { SearchBar } from "./search-bar"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAuth()
  const { cart } = useCart()
  const { selectedCity, setSelectedCity, cities } = useLocation()
  const [showLocationDropdown, setShowLocationDropdown] = useState(false)

  const handleUseCurrentLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          try {
            // Use Nominatim API for reverse geocoding (free, no API key needed)
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
            )
            const data = await response.json()
            const city = data.address?.city || data.address?.town || data.address?.village || "Unknown Location"
            setSelectedCity(city)
            setShowLocationDropdown(false)
          } catch (error) {
            console.error("Error fetching location:", error)
            // Fallback: set to a default or show error
            setSelectedCity("Location Unavailable")
            setShowLocationDropdown(false)
          }
        },
        (error) => {
          console.error("Error getting location:", error)
          setSelectedCity("Location Access Denied")
          setShowLocationDropdown(false)
        },
      )
    } else {
      console.error("Geolocation not supported")
      setSelectedCity("Geolocation Not Supported")
      setShowLocationDropdown(false)
    }
  }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">
          {/* Logo and Location */}
          <div className="flex items-center gap-4 flex-1">
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">📚</span>
              </div>
              <span className="font-bold text-xl text-black hidden sm:inline">CampusShelf</span>
            </Link>

            <div className="md:relative">
              <button
                onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg bg-white hover:border-gray-400 transition cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-black">{selectedCity || "All Colleges"}</span>
              </button>

              {showLocationDropdown && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                  <button
                    onClick={handleUseCurrentLocation}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm font-medium text-accent border-b border-gray-200"
                  >
                    📍 Use Current Location
                  </button>
                  {cities.map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        setSelectedCity(city)
                        setShowLocationDropdown(false)
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-100 text-sm ${
                        selectedCity === city ? "bg-accent bg-opacity-10 text-black font-medium" : ""
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Center Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md">
            <SearchBar />
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            <select className="text-sm font-medium text-gray-700 bg-white border-0 cursor-pointer hover:text-accent">
              <option>ENGLISH</option>
              <option>HINDI</option>
            </select>

            <Link href="/favorites" className="p-2 hover:bg-gray-100 rounded-lg transition">
              <span className="text-lg">❤️</span>
            </Link>

            <Link href="/chat" className="relative p-2 hover:bg-gray-100 rounded-lg transition">
              <MessageSquare className="w-5 h-5 text-gray-700" />
            </Link>

            <Link href="/cart" className="relative p-2 hover:bg-gray-100 rounded-lg transition">
              <ShoppingCart className="w-5 h-5 text-gray-700" />
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
                <Link
                  href="/login"
                  className="px-4 py-2 text-primary font-medium hover:bg-gray-100 rounded-lg transition"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-6 py-2 bg-accent text-accent-foreground font-bold rounded-full hover:opacity-90 transition"
                >
                  + SELL
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
            <Link href="/products" className="block px-4 py-2 hover:bg-gray-100 rounded-lg">
              Browse
            </Link>
            <Link href="/post-ad" className="block px-4 py-2 hover:bg-gray-100 rounded-lg">
              Sell
            </Link>
            <Link href="/chat" className="block px-4 py-2 hover:bg-gray-100 rounded-lg">
              Messages
            </Link>
            <Link href="/cart" className="block px-4 py-2 hover:bg-gray-100 rounded-lg">
              Cart ({cart.length})
            </Link>
            {user ? (
              <>
                <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100 rounded-lg">
                  Profile
                </Link>
                <Link href="/favorites" className="block px-4 py-2 hover:bg-gray-100 rounded-lg">
                  Favorites
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="block px-4 py-2 hover:bg-gray-100 rounded-lg">
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






