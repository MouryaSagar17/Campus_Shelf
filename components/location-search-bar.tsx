"use client"

import { useState, useRef, useEffect } from "react"
import { MapPin, Loader } from "lucide-react"

const CITIES = [
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

interface LocationSearchBarProps {
  onLocationSelect: (location: string) => void
  selectedLocation: string
}

export function LocationSearchBar({ onLocationSelect, selectedLocation }: LocationSearchBarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleUseCurrentLocation = () => {
    setIsLoadingLocation(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Simulate location to city mapping
          const cities = CITIES
          const randomCity = cities[Math.floor(Math.random() * cities.length)]
          onLocationSelect(randomCity)
          setIsLoadingLocation(false)
          setIsOpen(false)
        },
        () => {
          // Fallback if geolocation fails
          onLocationSelect("Hyderabad")
          setIsLoadingLocation(false)
          setIsOpen(false)
        },
      )
    } else {
      onLocationSelect("Hyderabad")
      setIsLoadingLocation(false)
      setIsOpen(false)
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg bg-background hover:bg-muted transition w-full sm:w-auto"
      >
        <MapPin className="w-4 h-4 text-accent" />
        <span className="text-sm font-medium">{selectedLocation || "Select Location"}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-lg z-50">
          {/* Use Current Location */}
          <button
            onClick={handleUseCurrentLocation}
            disabled={isLoadingLocation}
            className="w-full flex items-center gap-2 px-4 py-3 hover:bg-muted transition border-b border-border disabled:opacity-50"
          >
            {isLoadingLocation ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                <span className="text-sm font-medium">Detecting location...</span>
              </>
            ) : (
              <>
                <MapPin className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium">Use Current Location</span>
              </>
            )}
          </button>

          {/* City List */}
          <div className="py-2 max-h-64 overflow-y-auto">
            {CITIES.map((city) => (
              <button
                key={city}
                onClick={() => {
                  onLocationSelect(city)
                  setIsOpen(false)
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-muted transition ${
                  selectedLocation === city ? "bg-accent/10 text-accent font-medium" : "text-foreground"
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
