"use client"

import { useEffect, useMemo, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { branches } from "@/lib/free-shelf-data"
import { BookOpen, ChevronRight, Upload } from "lucide-react"
import { useI18n } from "@/lib/i18n-context"
import { useAuth } from "@/lib/auth-context"

export default function FreeShelfPage() {
  const [selectedBranchId, setSelectedBranchId] = useState(branches[0]?.id ?? "cse")
  const [activeBook, setActiveBook] = useState(null)
  const [uploadedBooksByBranch, setUploadedBooksByBranch] = useState({})
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState("")
  const [uploadSuccess, setUploadSuccess] = useState("")
  const [uploadTitle, setUploadTitle] = useState("")
  const [uploadDescription, setUploadDescription] = useState("")
  const [uploadFile, setUploadFile] = useState(null)
  const { t } = useI18n()
  const { user } = useAuth()

  const selectedBranch = useMemo(
    () => branches.find((b) => b.id === selectedBranchId) ?? branches[0],
    [selectedBranchId],
  )

  useEffect(() => {
    const loadUploads = async () => {
      try {
        const res = await fetch(`/api/free-shelf?branchId=${selectedBranchId}`, { cache: "no-store" })
        const json = await res.json()
        if (json.ok) {
          setUploadedBooksByBranch((prev) => ({
            ...prev,
            [selectedBranchId]: json.data || [],
          }))
        }
      } catch {
        // ignore
      }
    }
    loadUploads()
  }, [selectedBranchId])

  return (
    <div className="min-h-screen flex flex-col bg-yellow-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <span>{t("nav.freeShelf")}</span>
              <span className="text-sm font-semibold px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                {t("nav.freeShelfTagline")}
              </span>
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Read curated engineering books and quick notes for free. No downloads, just clean reading experience.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Branch Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-card rounded-lg border border-border p-4 sticky top-20">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                <span>Branches</span>
              </h2>
              <div className="space-y-2">
                {branches.map((branch) => (
                  <button
                    key={branch.id}
                    onClick={() => {
                      setSelectedBranchId(branch.id)
                      setActiveBook(null)
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between transition ${
                      branch.id === selectedBranchId
                        ? "bg-accent text-accent-foreground font-semibold"
                        : "bg-muted hover:bg-muted/80 text-foreground"
                    }`}
                  >
                    <span>
                      {branch.short} — {branch.name}
                    </span>
                    {branch.id === selectedBranchId && <ChevronRight className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Books & Reader */}
          <section className="lg:col-span-3 space-y-6">
            {/* Books list */}
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="mb-4">
                <h2 className="text-xl font-bold mb-1">{selectedBranch.name}</h2>
                <p className="text-sm text-muted-foreground">{selectedBranch.description}</p>
              </div>

              {selectedBranch.books.length > 0 || (uploadedBooksByBranch[selectedBranchId]?.length ?? 0) > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    ...selectedBranch.books.map((book) => ({
                      ...book,
                      _source: "static",
                    })),
                    ...(uploadedBooksByBranch[selectedBranchId] || []).map((entry) => ({
                      id: entry._id,
                      title: entry.title,
                      author: entry.ownerName || "CampusShelf User",
                      level: entry.fileName || "User Upload",
                      description: entry.description || "",
                      content: entry.content,
                      _source: "uploaded",
                      _ownerId: entry.ownerId,
                    })),
                  ].map((book) => (
                    <div
                      key={book.id}
                      className={`border rounded-lg p-4 flex flex-col justify-between gap-3 ${
                        activeBook?.id === book.id ? "border-accent ring-1 ring-accent" : "border-border"
                      }`}
                    >
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{book.title}</h3>
                        <p className="text-xs text-muted-foreground mb-1">
                          {book.author} • {book.level}
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-3">{book.description}</p>
                      </div>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => setActiveBook(book)}
                          className="inline-flex items-center justify-center px-3 py-2 text-xs font-semibold rounded-lg bg-accent text-accent-foreground hover:opacity-90 transition"
                        >
                          Read Online
                        </button>
                        {book._source === "uploaded" && user && String(book._ownerId) === String(user.id) && (
                          <button
                            type="button"
                            onClick={async () => {
                              if (!window.confirm("Delete this uploaded note from Free Shelf?")) return
                              try {
                                const res = await fetch(`/api/free-shelf/${book.id}`, { method: "DELETE" })
                                const json = await res.json()
                                if (!json.ok) throw new Error(json.error || "Failed to delete")
                                setUploadedBooksByBranch((prev) => ({
                                  ...prev,
                                  [selectedBranchId]: (prev[selectedBranchId] || []).filter((e) => String(e._id) !== String(book.id)),
                                }))
                                if (activeBook?.id === book.id) {
                                  setActiveBook(null)
                                }
                              } catch (err) {
                                alert(err.message || "Delete failed")
                              }
                            }}
                            className="inline-flex items-center justify-center px-3 py-2 text-xs font-semibold rounded-lg border border-red-500 text-red-600 hover:bg-red-50 transition"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No free books added yet for this branch.
                </div>
              )}
            </div>

            {/* Upload form */}
            <div className="bg-card rounded-lg border border-dashed border-accent/60 p-6">
              <div className="flex items-center justify-between mb-4 gap-3">
                <div className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-accent" />
                  <div>
                    <h3 className="font-semibold text-lg">Upload to Free Shelf</h3>
                    <p className="text-xs text-muted-foreground">
                      Add your own notes or text-based books for other students to read online (no downloads).
                    </p>
                  </div>
                </div>
              </div>

              {user ? (
                <form
                  className="space-y-4"
                  onSubmit={async (e) => {
                    e.preventDefault()
                    setUploadError("")
                    setUploadSuccess("")

                    if (!uploadTitle || !uploadFile) {
                      setUploadError("Title and file are required.")
                      return
                    }

                    setUploading(true)
                    try {
                      const fd = new FormData()
                      fd.append("branchId", selectedBranchId)
                      fd.append("title", uploadTitle)
                      fd.append("description", uploadDescription)
                      fd.append("file", uploadFile)

                      const res = await fetch("/api/free-shelf", { method: "POST", body: fd })
                      const json = await res.json()
                      if (!json.ok) {
                        throw new Error(json.error || "Failed to upload")
                      }

                      setUploadedBooksByBranch((prev) => ({
                        ...prev,
                        [selectedBranchId]: [json.data, ...(prev[selectedBranchId] || [])],
                      }))
                      setUploadTitle("")
                      setUploadDescription("")
                      setUploadFile(null)
                      setUploadSuccess("Upload successful! Your notes are now available in Free Shelf.")
                    } catch (err) {
                      setUploadError(err.message || "Upload failed. Please try again.")
                    } finally {
                      setUploading(false)
                    }
                  }}
                >
                  {uploadError && (
                    <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
                      {uploadError}
                    </div>
                  )}
                  {uploadSuccess && (
                    <div className="text-xs text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2">
                      {uploadSuccess}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1">Title *</label>
                      <input
                        type="text"
                        value={uploadTitle}
                        onChange={(e) => setUploadTitle(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder="e.g., C Programming Notes"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">Short Description</label>
                      <input
                        type="text"
                        value={uploadDescription}
                        onChange={(e) => setUploadDescription(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder="Optional summary of your notes"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">Upload File (text-based) *</label>
                    <label className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground text-xs font-semibold rounded-lg cursor-pointer hover:opacity-90 transition">
                      <Upload className="w-4 h-4" />
                      <span>{uploadFile ? uploadFile.name : "Choose file"}</span>
                      <input
                        type="file"
                        accept=".txt,.md,.markdown,.json,.csv"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          setUploadFile(file || null)
                        }}
                        className="hidden"
                        required
                      />
                    </label>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      Supported formats: <strong>.txt, .md, .markdown, .json, .csv</strong>. Content will be readable online only (no direct download).
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={uploading}
                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-lg bg-accent text-accent-foreground hover:opacity-90 transition disabled:opacity-50"
                  >
                    {uploading ? "Uploading..." : "Upload to this Branch"}
                  </button>
                </form>
              ) : (
                <div className="text-sm text-muted-foreground">
                  Please{" "}
                  <a href="/login?redirect=/free-shelf" className="text-accent underline">
                    login
                  </a>{" "}
                  to upload your notes to Free Shelf.
                </div>
              )}
            </div>

            {/* Reader Panel */}
            {activeBook && (
              <div className="bg-card rounded-lg border border-border p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">{activeBook.title}</h2>
                    <p className="text-sm text-muted-foreground">
                      {activeBook.author} • {activeBook.level} • {selectedBranch.short}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveBook(null)}
                    className="text-sm text-muted-foreground hover:text-foreground px-3 py-1 rounded-lg border border-border"
                  >
                    Close
                  </button>
                </div>

                <div className="border border-border rounded-lg bg-muted/40 p-4 max-h-[420px] overflow-y-auto text-sm leading-relaxed whitespace-pre-wrap">
                  {activeBook.content}
                </div>

                <p className="mt-3 text-xs text-muted-foreground">
                  Reading is free. Downloading is disabled to respect content guidelines.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}


