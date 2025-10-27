"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface ChatMessage {
  id: string
  senderId: number
  senderName: string
  text: string
  timestamp: Date
  isEdited: boolean
  isDeleted: boolean
}

export interface ChatConversation {
  id: string
  sellerId: number
  sellerName: string
  sellerPhone: string
  productId: number
  productTitle: string
  messages: ChatMessage[]
  lastMessage?: ChatMessage
}

interface ChatContextType {
  conversations: ChatConversation[]
  currentConversation: ChatConversation | null
  setCurrentConversation: (conversation: ChatConversation | null) => void
  sendMessage: (conversationId: string, text: string, senderId: number, senderName: string) => void
  editMessage: (conversationId: string, messageId: string, newText: string) => void
  deleteMessage: (conversationId: string, messageId: string) => void
  deleteConversation: (conversationId: string) => void
  startConversation: (
    sellerId: number,
    sellerName: string,
    sellerPhone: string,
    productId: number,
    productTitle: string,
  ) => ChatConversation
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<ChatConversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<ChatConversation | null>(null)

  // Load conversations from localStorage on mount
  useEffect(() => {
    const storedConversations = localStorage.getItem("campusshelf_chats")
    if (storedConversations) {
      const parsed = JSON.parse(storedConversations)
      // Convert date strings back to Date objects
      const conversations = parsed.map((conv: any) => ({
        ...conv,
        messages: conv.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        })),
        lastMessage: conv.lastMessage
          ? {
              ...conv.lastMessage,
              timestamp: new Date(conv.lastMessage.timestamp),
            }
          : undefined,
      }))
      setConversations(conversations)
    }
  }, [])

  const sendMessage = (conversationId: string, text: string, senderId: number, senderName: string) => {
    setConversations((prev) => {
      const updated = prev.map((conv) => {
        if (conv.id === conversationId) {
          const newMessage: ChatMessage = {
            id: `msg_${Date.now()}`,
            senderId,
            senderName,
            text,
            timestamp: new Date(),
            isEdited: false,
            isDeleted: false,
          }
          return {
            ...conv,
            messages: [...conv.messages, newMessage],
            lastMessage: newMessage,
          }
        }
        return conv
      })
      localStorage.setItem("campusshelf_chats", JSON.stringify(updated))
      return updated
    })
  }

  const editMessage = (conversationId: string, messageId: string, newText: string) => {
    setConversations((prev) => {
      const updated = prev.map((conv) => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            messages: conv.messages.map((msg) => {
              if (msg.id === messageId) {
                return {
                  ...msg,
                  text: newText,
                  isEdited: true,
                }
              }
              return msg
            }),
          }
        }
        return conv
      })
      localStorage.setItem("campusshelf_chats", JSON.stringify(updated))
      return updated
    })
  }

  const deleteMessage = (conversationId: string, messageId: string) => {
    setConversations((prev) => {
      const updated = prev.map((conv) => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            messages: conv.messages.map((msg) => {
              if (msg.id === messageId) {
                return {
                  ...msg,
                  isDeleted: true,
                  text: "This message was deleted",
                }
              }
              return msg
            }),
          }
        }
        return conv
      })
      localStorage.setItem("campusshelf_chats", JSON.stringify(updated))
      return updated
    })
  }

  const deleteConversation = (conversationId: string) => {
    setConversations((prev) => {
      const updated = prev.filter((conv) => conv.id !== conversationId)
      localStorage.setItem("campusshelf_chats", JSON.stringify(updated))
      return updated
    })
    setCurrentConversation(null)
  }

  const startConversation = (
    sellerId: number,
    sellerName: string,
    sellerPhone: string,
    productId: number,
    productTitle: string,
  ): ChatConversation => {
    const existingConv = conversations.find((conv) => conv.sellerId === sellerId && conv.productId === productId)

    if (existingConv) {
      return existingConv
    }

    const newConversation: ChatConversation = {
      id: `chat_${Date.now()}`,
      sellerId,
      sellerName,
      sellerPhone,
      productId,
      productTitle,
      messages: [
        {
          id: `msg_${Date.now()}`,
          senderId: -1,
          senderName: "System",
          text: "Hi, I'm interested in your post.",
          timestamp: new Date(),
          isEdited: false,
          isDeleted: false,
        },
      ],
    }

    setConversations((prev) => {
      const updated = [...prev, newConversation]
      localStorage.setItem("campusshelf_chats", JSON.stringify(updated))
      return updated
    })

    return newConversation
  }

  return (
    <ChatContext.Provider
      value={{
        conversations,
        currentConversation,
        setCurrentConversation,
        sendMessage,
        editMessage,
        deleteMessage,
        deleteConversation,
        startConversation,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error("useChat must be used within ChatProvider")
  }
  return context
}
