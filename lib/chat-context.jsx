"use client"

import { createContext, useContext, useState, useEffect } from "react"

const ChatContext = createContext(undefined)

export function ChatProvider({ children }) {
  const [conversations, setConversations] = useState([])
  const [currentConversation, setCurrentConversation] = useState(null)

  useEffect(() => {
    const storedConversations = localStorage.getItem("campusshelf_chats")
    if (storedConversations) {
      const parsed = JSON.parse(storedConversations)
      const conversations = parsed.map((conv) => ({
        ...conv,
        messages: conv.messages.map((msg) => ({
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

  const sendMessage = (conversationId, text, senderId, senderName) => {
    setConversations((prev) => {
      const updated = prev.map((conv) => {
        if (conv.id === conversationId) {
          const newMessage = {
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

  const editMessage = (conversationId, messageId, newText) => {
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

  const deleteMessage = (conversationId, messageId) => {
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

  const deleteConversation = (conversationId) => {
    setConversations((prev) => {
      const updated = prev.filter((conv) => conv.id !== conversationId)
      localStorage.setItem("campusshelf_chats", JSON.stringify(updated))
      return updated
    })
    setCurrentConversation(null)
  }

  const startConversation = (sellerId, sellerName, sellerPhone, productId, productTitle) => {
    const existingConv = conversations.find((conv) => conv.sellerId === sellerId && conv.productId === productId)

    if (existingConv) {
      return existingConv
    }

    const newConversation = {
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






