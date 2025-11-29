"use client"

import { Search } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"

export function SearchBar({ onSearch, onSubmit, placeholder = "Search notes, books..." }) {
  const [query, setQuery] = useState("")
  const debounceRef = useRef(null)
  const router = useRouter()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (onSubmit) {
      onSubmit(query)
    } else {
      // Default behavior: navigate to products page with search query
      router.push(`/products?q=${encodeURIComponent(query)}`)
    }
  }

  useEffect(() => {
    if (!onSearch) return
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      onSearch(query)
    }, 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, onSearch])

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 pl-10 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
        />
        <Search className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
      </div>
    </form>
  )
}



