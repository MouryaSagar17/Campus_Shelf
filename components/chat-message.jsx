"use client"

import { useState } from "react"
import { MoreVertical, Edit2, Trash2, Check, X } from "lucide-react"
import { useChat } from "@/lib/chat-context"
import { getRelativeTime } from "@/lib/time-utils"

export function ChatMessage({
  conversationId,
  messageId,
  senderName,
  text,
  timestamp,
  isOwn,
  isEdited,
  isDeleted,
}) {
  const { editMessage, deleteMessage } = useChat()
  const [isEditing, setIsEditing] = useState(false)
  const [editedText, setEditedText] = useState(text)
  const [showMenu, setShowMenu] = useState(false)
  const canEdit = isOwn && !isDeleted && Date.now() - timestamp.getTime() < 2 * 60 * 1000

  const handleSaveEdit = () => {
    if (editedText.trim()) {
      editMessage(conversationId, messageId, editedText)
      setIsEditing(false)
    }
  }

  const handleDelete = () => {
    deleteMessage(conversationId, messageId)
    setShowMenu(false)
  }

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-xs lg:max-w-md ${isOwn ? "bg-accent text-accent-foreground" : "bg-muted text-foreground"} rounded-lg p-3 relative group`}
      >
        {!isOwn && <p className="text-xs font-semibold mb-1 opacity-70">{senderName}</p>}

        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="w-full px-2 py-1 text-sm border border-border rounded bg-background text-foreground"
              rows={2}
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveEdit}
                className="flex items-center gap-1 text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              >
                <Check className="w-3 h-3" />
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditing(false)
                  setEditedText(text)
                }}
                className="flex items-center gap-1 text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                <X className="w-3 h-3" />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm">{text}</p>
            <div className="flex items-center justify-between mt-1 gap-2">
              <p className="text-xs opacity-70">{getRelativeTime(timestamp)}</p>
              {isEdited && <p className="text-xs opacity-70">(edited)</p>}
            </div>
          </>
        )}

        {/* Message Menu */}
        {isOwn && !isDeleted && (
          <div className="absolute -right-8 top-0 opacity-0 group-hover:opacity-100 transition">
            <div className="relative">
              <button onClick={() => setShowMenu(!showMenu)} className="p-1 hover:bg-muted rounded transition">
                <MoreVertical className="w-4 h-4" />
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-1 w-32 bg-card border border-border rounded-lg shadow-lg z-50">
                  {canEdit && (
                    <button
                      onClick={() => {
                        setIsEditing(true)
                        setShowMenu(false)
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition text-foreground"
                    >
                      <Edit2 className="w-3 h-3" />
                      Edit
                    </button>
                  )}
                  <button
                    onClick={handleDelete}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-red-50 text-red-600 transition"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}




