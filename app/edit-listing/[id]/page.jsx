"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Upload, X } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function EditListingPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const id = params.id
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Notes",
    price: "",
    college: "",
    images: [],
  })
  const [existingImages, setExistingImages] = useState([])
  const [newImages, setNewImages] = useState([])
  const [keepExistingImages, setKeepExistingImages] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }
    loadListing()
  }, [id, user])

  const loadListing = async () => {
    try {
      const res = await fetch(`/api/listings/${id}`, { cache: "no-store" })
      const json = await res.json()
      if (json.ok) {
        const listing = json.data
        setFormData({
          title: listing.title || "",
          description: listing.description || "",
          category: listing.category || "Notes",
          price: String(listing.price || ""),
          college: listing.college || "",
          images: [],
        })
        setExistingImages(listing.images || [])
        setLoading(false)
      } else {
        setMessage("Listing not found")
        setLoading(false)
      }
    } catch (err) {
      setMessage("Failed to load listing")
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      setNewImages((prev) => [...prev, ...files])
    }
  }

  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index))
  }

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage("")
    setIsSuccess(false)
    try {
      const priceNum = Number(formData.price)
      if (!formData.title.trim() || !formData.description.trim() || !formData.category.trim() || !formData.college.trim() || Number.isNaN(priceNum) || priceNum <= 0) {
        setMessage("Please fill all required fields and ensure price is > 0.")
        setIsSuccess(false)
        return
      }

      const fd = new FormData()
      fd.append("title", formData.title)
      fd.append("description", formData.description)
      fd.append("category", formData.category)
      fd.append("price", String(priceNum))
      fd.append("college", formData.college)
      
      // If we have existing images that should be kept, send them as well
      // Otherwise, only send new images (which will replace existing)
      if (keepExistingImages && existingImages.length > 0) {
        fd.append("keepExistingImages", "true")
        // Add new images to the existing ones
        newImages.forEach((image) => {
          fd.append("images", image)
        })
      } else if (newImages.length > 0) {
        // Replace all images with new ones
        fd.append("keepExistingImages", "false")
        newImages.forEach((image) => {
          fd.append("images", image)
        })
      } else {
        // No new images, keep existing
        fd.append("keepExistingImages", "true")
      }

      const res = await fetch(`/api/listings/${id}`, { method: "PUT", body: fd })
      const json = await res.json()
      if (json.ok) {
        setMessage("Listing updated successfully!")
        setIsSuccess(true)
        setTimeout(() => {
          router.push("/my-listings")
        }, 1500)
      } else {
        setMessage(json.error || "Failed to update listing")
        setIsSuccess(false)
      }
    } catch (err) {
      setMessage("Failed to update listing")
      setIsSuccess(false)
    } finally {
      setSubmitting(false)
    }
  }

  // auto-dismiss message
  useEffect(() => {
    if (!message) return
    const t = setTimeout(() => setMessage(""), 3000)
    return () => clearTimeout(t)
  }, [message])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground">Loading...</div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Edit Listing</h1>
          <p className="text-muted-foreground">Update your listing details and images</p>
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

          {/* Category and Price */}
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

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold">Existing Images</label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={keepExistingImages}
                    onChange={(e) => setKeepExistingImages(e.target.checked)}
                    className="w-4 h-4"
                  />
                  Keep existing images
                </label>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {existingImages.map((image, index) => (
                  <div key={index} className="relative">
                    {image && image.startsWith('data:') ? (
                      <img
                        src={image}
                        alt={`Existing ${index + 1}`}
                        className="w-full h-20 object-cover rounded border"
                      />
                    ) : (
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Existing ${index + 1}`}
                        className="w-full h-20 object-cover rounded border"
                      />
                    )}
                    {!keepExistingImages && (
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add New Images */}
          <div>
            <label className="block text-sm font-semibold mb-2">Add New Images (Optional)</label>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-accent transition">
              <input type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" id="image-upload" />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium">
                  {newImages.length > 0 ? `${newImages.length} new image(s) selected` : "Click to upload or drag and drop"}
                </p>
                <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB each</p>
              </label>
            </div>
            {newImages.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-2">
                {newImages.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`New ${index + 1}`}
                      className="w-full h-20 object-cover rounded border"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {message && (
            <div className={`text-sm text-center ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-6 py-3 bg-accent text-accent-foreground font-bold rounded-lg hover:opacity-90 transition disabled:opacity-50"
            >
              {submitting ? "Updating..." : "Update Listing"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/my-listings")}
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

