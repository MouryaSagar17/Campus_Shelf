"use client"

import type React from "react"

import Link from "next/link"
import { Heart, MapPin } from "lucide-react"
import { useFavorites } from "@/lib/favorites-context"
import { getRelativeTime } from "@/lib/time-utils"

interface ProductCardProps {
  id: number
  title: string
  price: number
  originalPrice?: number
  image: string
  college: string
  category: string
  rating: number
  reviews: number
  postedAt?: Date
  quantity?: number
}

export function ProductCard({
  id,
  title,
  price,
  originalPrice,
  image,
  college,
  category,
  rating,
  reviews,
  postedAt,
  quantity = 1,
}: ProductCardProps) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites()
  const favorited = isFavorite(id)

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (favorited) {
      removeFavorite(id)
    } else {
      addFavorite(id)
    }
  }

  const postedTime = postedAt ? getRelativeTime(postedAt) : "Recently"

  return (
    <Link href={`/products/${id}`}>
      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full flex flex-col border border-gray-200">
        {/* Image Container */}
        <div className="relative w-full h-56 bg-gray-100 overflow-hidden group">
          <img
            src={image || "/placeholder.svg"}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <span className="absolute bottom-3 left-3 bg-accent text-accent-foreground px-3 py-1 rounded text-xs font-bold">
            FEATURED
          </span>
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition"
          >
            <Heart className={`w-5 h-5 ${favorited ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Price - Prominent */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl font-bold text-primary">₹{price}</span>
            {originalPrice && originalPrice > price && (
              <span className="text-sm text-gray-500 line-through">₹{originalPrice}</span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-semibold text-foreground line-clamp-2 mb-3 text-sm">{title}</h3>

          {/* College and Location */}
          <div className="flex items-center gap-1 text-xs text-gray-600 mb-3">
            <MapPin className="w-3 h-3" />
            <span>{college}</span>
          </div>

          {/* Posted Time and Date */}
          <p className="text-xs text-gray-500 mb-3">{postedTime.toUpperCase()}</p>
        </div>
      </div>
    </Link>
  )
}
