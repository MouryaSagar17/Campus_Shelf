"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Upload } from "lucide-react"

export default function PostAdPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Notes",
    price: "",
    college: "",
    images: [],
  })
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      setFormData((prev) => ({ ...prev, images: [...prev.images, ...files] }))
    }
  }

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage("")
    setIsSuccess(false)
    try {
      const priceNum = Number(formData.price)
      if (!formData.title.trim() || !formData.description.trim() || !formData.category.trim() || !formData.college.trim() || Number.isNaN(priceNum) || priceNum <= 0 || formData.images.length < 3) {
        setMessage("Please fill all required fields, provide a description, upload at least 3 images, and ensure price is > 0.")
        setIsSuccess(false)
        return
      }
      const fd = new FormData()
      fd.append("title", formData.title)
      fd.append("description", formData.description)
      fd.append("category", formData.category)
      fd.append("price", String(priceNum))
      fd.append("college", formData.college)
      formData.images.forEach((image, index) => {
        fd.append(`images`, image)
      })
      const res = await fetch("/api/listings", { method: "POST", body: fd })
      const json = await res.json()
      if (json.ok) {
        setMessage("Ad posted successfully!")
        setIsSuccess(true)
        setFormData({ title: "", description: "", category: "Notes", price: "", college: "", images: [] })
      } else {
        setMessage(json.error || "Failed to post ad")
        setIsSuccess(false)
      }
    } catch (err) {
      setMessage("Failed to post ad")
      setIsSuccess(false)
    } finally {
      setSubmitting(false)
    }
  }

  // auto-dismiss message after 3 seconds
  useEffect(() => {
    if (!message) return
    const t = setTimeout(() => setMessage(""), 3000)
    return () => clearTimeout(t)
  }, [message])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Post Your Ad</h1>
          <p className="text-muted-foreground">Sell your notes or books to fellow students</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card rounded-lg p-8 border border-border space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold mb-2">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Advanced Calculus Notes"
              required
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {/* Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option>Notes</option>
                <option>Books</option>
                <option>Electronics</option>
                <option>Rental Laptops</option>
                <option>Lab Uniforms</option>
                <option>Stationery</option>
                <option>ID Card Tags</option>
                <option>Lab Equipment</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Price (₹) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="299"
                required
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>

          {/* College */}
          <div>
            <label className="block text-sm font-semibold mb-2">College *</label>
            <input
              type="text"
              name="college"
              value={formData.college}
              onChange={handleChange}
              placeholder="e.g., IIT Delhi"
              required
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-2">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your item in detail..."
              required
              rows={5}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent resize-none"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold mb-2">Upload Images (Minimum 3) *</label>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-accent transition">
              <input type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" id="image-upload" />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium">
                  {formData.images.length > 0 ? `${formData.images.length} image(s) selected` : "Click to upload or drag and drop"}
                </p>
                <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB each (minimum 3 images)</p>
              </label>
            </div>
            {formData.images.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-2">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-20 object-cover rounded border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {message && <div className="text-sm text-center text-muted-foreground">{message}</div>}

          {/* Submit */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-6 py-3 bg-accent text-accent-foreground font-bold rounded-lg hover:opacity-90 transition disabled:opacity-50"
            >
              {submitting ? "Posting..." : "Post Ad"}
            </button>
            <button
              type="button"
              onClick={() => setFormData({ title: "", description: "", category: "Notes", price: "", college: "", images: [] })}
              className="flex-1 px-6 py-3 border-2 border-border text-foreground font-bold rounded-lg hover:bg-muted transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </main>

      {/* Toast */}
      {message ? (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded shadow-md ${isSuccess ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
          {message}
        </div>
      ) : null}

      <Footer />
    </div>
  )
}
