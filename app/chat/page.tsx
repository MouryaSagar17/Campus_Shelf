"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ChatMessage } from "@/components/chat-message"
import { useChat } from "@/lib/chat-context"
import { useAuth } from "@/lib/auth-context"
import { Send, Trash2, Phone } from "lucide-react"

export default function ChatPage() {
  const { conversations, currentConversation, setCurrentConversation, sendMessage, deleteConversation } = useChat()
  const { user } = useAuth()
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [currentConversation?.messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim() && currentConversation && user) {
      sendMessage(currentConversation.id, newMessage, user.id, user.name)
      setNewMessage("")
    }
  }

  const handleDeleteConversation = () => {
    if (currentConversation && confirm("Are you sure you want to delete this conversation?")) {
      deleteConversation(currentConversation.id)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
          {/* Conversations List */}
          <div className="lg:col-span-1 bg-card rounded-lg border border-border overflow-hidden flex flex-col">
            <div className="p-4 border-b border-border">
              <h2 className="font-bold text-lg">Messages</h2>
              <p className="text-xs text-muted-foreground">{conversations.length} conversation(s)</p>
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground text-sm">
                  No conversations yet. Start chatting with sellers!
                </div>
              ) : (
                conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setCurrentConversation(conv)}
                    className={`w-full text-left p-3 hover:bg-muted border-b border-border transition ${
                      currentConversation?.id === conv.id ? "bg-accent/10 border-l-4 border-l-accent" : ""
                    }`}
                  >
                    <p className="font-semibold text-sm">{conv.sellerName}</p>
                    <p className="text-xs text-muted-foreground truncate">{conv.productTitle}</p>
                    {conv.lastMessage && (
                      <p className="text-xs text-muted-foreground truncate mt-1">{conv.lastMessage.text}</p>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          {currentConversation ? (
            <div className="lg:col-span-3 bg-card rounded-lg border border-border flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="font-bold">{currentConversation.sellerName}</h3>
                  <p className="text-xs text-muted-foreground">{currentConversation.productTitle}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Phone className="w-3 h-3 text-accent" />
                    <p className="text-xs text-muted-foreground">{currentConversation.sellerPhone}</p>
                  </div>
                </div>
                <button
                  onClick={handleDeleteConversation}
                  className="p-2 hover:bg-red-50 text-red-600 rounded transition"
                  title="Delete conversation"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {currentConversation.messages.map((msg) => (
                  <ChatMessage
                    key={msg.id}
                    conversationId={currentConversation.id}
                    messageId={msg.id}
                    senderName={msg.senderName}
                    text={msg.text}
                    timestamp={msg.timestamp}
                    isOwn={user?.id === msg.senderId}
                    isEdited={msg.isEdited}
                    isDeleted={msg.isDeleted}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-border">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="lg:col-span-3 bg-card rounded-lg border border-border flex items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground text-lg">Select a conversation to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
