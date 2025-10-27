"use client"

import type React from "react"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Send } from "lucide-react"

interface Message {
  id: number
  sender: "user" | "other"
  text: string
  timestamp: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: "other", text: "Hi, is this book still available?", timestamp: "10:30 AM" },
    { id: 2, sender: "user", text: "Yes, it's still available!", timestamp: "10:32 AM" },
    { id: 3, sender: "other", text: "Great! Can we meet tomorrow?", timestamp: "10:35 AM" },
    { id: 4, sender: "user", text: "Sure, let's meet at the library at 2 PM", timestamp: "10:36 AM" },
  ])
  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          sender: "user",
          text: newMessage,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ])
      setNewMessage("")
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
          {/* Conversations List */}
          <div className="lg:col-span-1 bg-card rounded-lg border border-border overflow-hidden flex flex-col">
            <div className="p-4 border-b border-border">
              <h2 className="font-bold text-lg">Messages</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="p-3 hover:bg-muted cursor-pointer border-b border-border">
                <p className="font-semibold text-sm">Priya Singh</p>
                <p className="text-xs text-muted-foreground truncate">Can we meet tomorrow?</p>
              </div>
              <div className="p-3 hover:bg-muted cursor-pointer border-b border-border bg-accent/10">
                <p className="font-semibold text-sm">Aditya Patel</p>
                <p className="text-xs text-muted-foreground truncate">Thanks for the notes!</p>
              </div>
              <div className="p-3 hover:bg-muted cursor-pointer border-b border-border">
                <p className="font-semibold text-sm">Vikram Sharma</p>
                <p className="text-xs text-muted-foreground truncate">Is it still available?</p>
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3 bg-card rounded-lg border border-border flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-border">
              <h3 className="font-bold">Priya Singh</h3>
              <p className="text-xs text-muted-foreground">Active now</p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.sender === "user" ? "bg-accent text-accent-foreground" : "bg-muted text-foreground"
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p className="text-xs opacity-70 mt-1">{msg.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-border">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
