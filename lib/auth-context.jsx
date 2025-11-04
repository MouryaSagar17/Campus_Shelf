"use client"

import { createContext, useContext, useEffect, useState } from "react"

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let ignore = false
    async function load() {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" })
        const json = await res.json()
        if (!ignore && json.ok) setUser(json.data)
      } catch {
        // Silently handle auth errors (user not logged in)
      }
      if (!ignore) setIsLoading(false)
    }
    load()
    return () => {
      ignore = true
    }
  }, [])

  const login = async (email, password) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    const json = await res.json()
    if (json.ok) setUser(json.data)
    else throw new Error(json.error || "Login failed")
  }

  const signup = async (email, password, name, college) => {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name, college }),
    })
    const json = await res.json()
    if (json.ok) setUser(json.data)
    else throw new Error(json.error || "Signup failed")
  }

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    setUser(null)
  }

  const updateProfile = async (updates) => {
    // Client-only update; a real backend route could be added for profile updates
    setUser((prev) => (prev ? { ...prev, ...updates } : prev))
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
