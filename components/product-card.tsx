"use client"

import Link from "next/link"
import { Heart, MapPin, Star } from "lucide-react"
import { useState } from "react"

interface ProductCardProps {
  id: number
  title: string
  price: number
  image: string
  college: string
  category: string
  rating: number
  reviews: number
}

export function ProductCard({ id, title, price, image, college, category, rating, reviews }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)

  return (
    <Link href={`/products/${id}`}>
      <div className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full flex flex-col">
        {/* Image Container */}
        <div className="relative w-full h-48 bg-muted overflow-hidden group">
          <img
            src={image || "/placeholder.svg"}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <button
            onClick={(e) => {
              e.preventDefault()
              setIsFavorite(!isFavorite)
            }}
            className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-muted transition"
          >
            <Heart className={`w-5 h-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
          </button>
          <span className="absolute top-3 left-3 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-semibold">
            {category}
          </span>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-foreground line-clamp-2 mb-2 text-sm">{title}</h3>

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

          {/* Location */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
            <MapPin className="w-3 h-3" />
            {college}
          </div>

          {/* Price and Button */}
          <div className="mt-auto flex items-center justify-between">
            <span className="text-lg font-bold text-primary">₹{price}</span>
            <button
              onClick={(e) => {
                e.preventDefault()
              }}
              className="px-3 py-1 bg-accent text-accent-foreground text-xs font-semibold rounded hover:opacity-90 transition"
            >
              View
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
