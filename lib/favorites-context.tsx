"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface FavoritesContextType {
  favorites: number[]
  addFavorite: (itemId: number) => void
  removeFavorite: (itemId: number) => void
  isFavorite: (itemId: number) => boolean
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<number[]>([])

  // Load favorites from localStorage on mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem("campusshelf_favorites")
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites))
    }
  }, [])

  const addFavorite = (itemId: number) => {
    setFavorites((prev) => {
      const updated = [...prev, itemId]
      localStorage.setItem("campusshelf_favorites", JSON.stringify(updated))
      return updated
    })
  }

  const removeFavorite = (itemId: number) => {
    setFavorites((prev) => {
      const updated = prev.filter((id) => id !== itemId)
      localStorage.setItem("campusshelf_favorites", JSON.stringify(updated))
      return updated
    })
  }

  const isFavorite = (itemId: number) => favorites.includes(itemId)

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error("useFavorites must be used within FavoritesProvider")
  }
  return context
}
