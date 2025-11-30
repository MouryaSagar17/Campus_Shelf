"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Heart, MapPin, Star } from "lucide-react"
import { useFavorites } from "@/lib/favorites-context"
import { getRelativeTime } from "@/lib/time-utils"

export function ProductCard({
  id,
  title,
  price,
  originalPrice,
  images,
  college,
  category,
  rating,
  reviews,
  postedAt,
  postedTime,
  quantity = 1,
}) {
  const image = images?.[0] || "/placeholder.svg"
  const { isFavorite, addFavorite, removeFavorite } = useFavorites()
  const favorited = isFavorite(id)

  const handleFavoriteClick = (e) => {
    e.preventDefault()
    if (favorited) {
      removeFavorite(id)
    } else {
      addFavorite(id)
    }
  }

  // Initialize with "Recently" to match server render, then update after hydration
  const [displayTime, setDisplayTime] = useState("Recently")

  useEffect(() => {
    if (postedAt) {
      setDisplayTime(getRelativeTime(new Date(postedAt)))
    } else if (postedTime) {
      setDisplayTime(postedTime)
    }
  }, [postedAt, postedTime])

  return (
    <Link href={`/products/${id}`}>
      <div className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full flex flex-col">
        {/* Image Container */}
        <div className="relative w-full h-48 bg-muted overflow-hidden group">
          {image && (image.startsWith('data:') || image.startsWith('/') || !image.startsWith('http')) ? (
            <img
              src={image || "/placeholder.svg"}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.src = "/placeholder.svg"
              }}
            />
          ) : (
            <Image
              src={image || "/placeholder.svg"}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              unoptimized
              onError={(e) => {
                e.target.src = "/placeholder.svg"
              }}
            />
          )}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-muted transition"
            suppressHydrationWarning
          >
            <Heart className={`w-5 h-5 ${favorited ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
          </button>
          <span className="absolute top-3 left-3 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-semibold">
            {category}
          </span>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-foreground line-clamp-2 mb-2 text-sm">{title}</h3>

          {/* Posted Time */}
          <p className="text-xs text-muted-foreground mb-2" suppressHydrationWarning>{displayTime}</p>

          {/* College and City */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
            <MapPin className="w-3 h-3" />
            <span>{college}</span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${i < Math.floor(rating) ? "fill-accent text-accent" : "text-muted-foreground"}`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">({reviews})</span>
          </div>



          {/* Price and Button */}
          <div className="mt-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-primary">₹{price}</span>
              {originalPrice && originalPrice > price && (
                <span className="text-sm text-muted-foreground line-through">₹{originalPrice}</span>
              )}
            </div>
            <button
              type="button"
              aria-label={`View ${title}`}
              className="px-3 py-1 bg-accent text-accent-foreground text-xs font-semibold rounded hover:opacity-90 transition"
              suppressHydrationWarning
            >
              View
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}



