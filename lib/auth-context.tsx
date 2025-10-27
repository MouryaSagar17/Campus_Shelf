"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: number
  email: string
  name: string
  college: string
  phone?: string
  about?: string
  emailVerified?: boolean
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string, college: string) => Promise<void>
  logout: () => void
  updateProfile: (updates: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("campusshelf_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // Simulate API call
    const mockUser: User = {
      id: Math.floor(Math.random() * 1000),
      email,
      name: email.split("@")[0],
      college: "IIT Delhi",
      emailVerified: true,
      about: "Student at IIT Delhi",
      phone: "+91 9876543210",
    }
    setUser(mockUser)
    localStorage.setItem("campusshelf_user", JSON.stringify(mockUser))
  }

  const signup = async (email: string, password: string, name: string, college: string) => {
    // Simulate API call
    const mockUser: User = {
      id: Math.floor(Math.random() * 1000),
      email,
      name,
      college,
      emailVerified: true,
      about: `Student at ${college}`,
      phone: "+91 9876543210",
    }
    setUser(mockUser)
    localStorage.setItem("campusshelf_user", JSON.stringify(mockUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("campusshelf_user")
  }

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      localStorage.setItem("campusshelf_user", JSON.stringify(updatedUser))
    }
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
