"use client"

import { X } from "lucide-react"
import Link from "next/link"
import { categoryDescriptions } from "@/lib/dummy-data"

export function CategoryModal({ isOpen, category, onClose }) {
  if (!isOpen || !category) return null

  const subcategories = [
    { name: "All", count: 45 },
    { name: "Popular", count: 12 },
    { name: "New Listings", count: 8 },
    { name: "Best Deals", count: 15 },
  ]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg max-w-2xl w-full shadow-lg max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card">
          <div>
            <h2 className="text-2xl font-bold">{category}</h2>
            <p className="text-sm text-muted-foreground mt-1">{categoryDescriptions[category]}</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Subcategories Grid */}
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {subcategories.map((sub) => (
              <Link
                key={sub.name}
                href={`/products?category=${category}&subcategory=${sub.name}`}
                onClick={onClose}
                className="p-4 border border-border rounded-lg hover:border-accent hover:bg-accent/5 transition text-center"
              >
                <p className="font-semibold text-foreground">{sub.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{sub.count} items</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border bg-muted/50">
          <Link
            href={`/products?category=${category}`}
            onClick={onClose}
            className="inline-block px-6 py-2 bg-accent text-accent-foreground font-semibold rounded-lg hover:opacity-90 transition"
          >
            View All {category}
          </Link>
        </div>
      </div>
    </div>
  )
}




