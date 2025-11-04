"use client"

import { createContext, useContext, useState, useEffect } from "react"

const FavoritesContext = createContext(undefined)

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    const storedFavorites = localStorage.getItem("campusshelf_favorites")
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites))
    }
  }, [])

  const addFavorite = (itemId) => {
    const id = String(itemId)
    setFavorites((prev) => {
      if (prev.includes(id)) return prev
      const updated = [...prev, id]
      localStorage.setItem("campusshelf_favorites", JSON.stringify(updated))
      return updated
    })
  }

  const removeFavorite = (itemId) => {
    const id = String(itemId)
    setFavorites((prev) => {
      const updated = prev.filter((curr) => curr !== id)
      localStorage.setItem("campusshelf_favorites", JSON.stringify(updated))
      return updated
    })
  }

  const isFavorite = (itemId) => favorites.includes(String(itemId))

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
