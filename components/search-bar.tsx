"use client"

import type React from "react"

import { Search, Mic, Camera } from "lucide-react"
import { useState } from "react"

interface SearchBarProps {
  onSearch?: (query: string) => void
  placeholder?: string
}

export function SearchBar({ onSearch, placeholder = "Search notes, books..." }: SearchBarProps) {
  const [query, setQuery] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(query)
  }

  const handleVoiceSearch = () => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      const recognition = new SpeechRecognition()
      recognition.start()
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setQuery(transcript)
        onSearch?.(transcript)
      }
    } else {
      alert("Voice search is not supported in your browser")
    }
  }

  const handleCameraSearch = () => {
    alert("Camera search feature coming soon!")
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 pl-10 pr-24 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
        />
        <Search className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />

        <div className="absolute right-3 top-3.5 flex items-center gap-2">
          <button
            type="button"
            onClick={handleVoiceSearch}
            className="p-1 hover:bg-muted rounded transition"
            title="Voice search"
          >
            <Mic className="w-5 h-5 text-muted-foreground hover:text-accent" />
          </button>
          <button
            type="button"
            onClick={handleCameraSearch}
            className="p-1 hover:bg-muted rounded transition"
            title="Camera search"
          >
            <Camera className="w-5 h-5 text-muted-foreground hover:text-accent" />
          </button>
        </div>
      </div>
    </form>
  )
}
