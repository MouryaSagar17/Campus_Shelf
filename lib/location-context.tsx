"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

interface LocationContextType {
  selectedCity: string
  setSelectedCity: (city: string) => void
  cities: string[]
}

const LocationContext = createContext<LocationContextType | undefined>(undefined)

export const cities = [
  "All Colleges",
  "Hyderabad",
  "Vijayawada",
  "Visakhapatnam",
  "Warangal",
  "Tirupati",
  "Guntur",
  "Delhi",
  "Mumbai",
  "Bangalore",
  "Chennai",
]

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [selectedCity, setSelectedCity] = useState("All Colleges")

  useEffect(() => {
    const saved = localStorage.getItem("selectedCity")
    if (saved) {
      setSelectedCity(saved)
    }
  }, [])

  const handleSetCity = (city: string) => {
    setSelectedCity(city)
    localStorage.setItem("selectedCity", city)
  }

  return (
    <LocationContext.Provider value={{ selectedCity, setSelectedCity: handleSetCity, cities }}>
      {children}
    </LocationContext.Provider>
  )
}

export function useLocation() {
  const context = useContext(LocationContext)
  if (!context) {
    throw new Error("useLocation must be used within LocationProvider")
  }
  return context
}
