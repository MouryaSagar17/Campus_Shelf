"use client"

import { useRouter } from "next/navigation"
import { categories, categoryIcons } from "@/lib/dummy-data"

export function CategoriesSection() {
  const router = useRouter()

  const handleCategoryClick = (category: string) => {
    if (category !== "All") {
      router.push(`/products?category=${encodeURIComponent(category)}`)
    } else {
      router.push("/products")
    }
  }

  return (
    <section className="bg-white py-6 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className="flex flex-col items-center gap-2 px-4 py-3 rounded-lg hover:bg-gray-100 transition flex-shrink-0 cursor-pointer"
            >
              <div className="text-3xl">{categoryIcons[category]}</div>
              <p className="font-medium text-sm text-gray-700 whitespace-nowrap">{category}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
