"use client"

import { useState } from "react"
import { categories, categoryIcons } from "@/lib/dummy-data"
import { CategoryModal } from "./category-modal"

export function CategoriesSection() {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCategoryClick = (category) => {
    if (category !== "All") {
      setSelectedCategory(category)
      setIsModalOpen(true)
    }
  }

  return (
    <>
      <section className="bg-background py-12 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8">Browse by Category</h2>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => handleCategoryClick(category)}
                disabled={category === "All"}
                aria-label={`Browse ${category}`}
                className={`p-6 rounded-lg border-2 transition ${
                  category === "All"
                    ? "border-border bg-muted cursor-default"
                    : "border-border hover:border-accent hover:bg-accent/5 cursor-pointer"
                }`}
              >
                <div className="text-4xl mb-3" aria-hidden="true">{categoryIcons[category] || "📚"}</div>
                <span className="font-semibold text-foreground text-sm block">{category || ""}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <CategoryModal isOpen={isModalOpen} category={selectedCategory} onClose={() => setIsModalOpen(false)} />
    </>
  )
}




