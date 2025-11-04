"use client"

import { Search } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export function SearchBar({ onSearch, placeholder = "Search notes, books..." }) {
  const [query, setQuery] = useState("")
  const debounceRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch?.(query)
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



