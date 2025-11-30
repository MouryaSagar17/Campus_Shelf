"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { dummyItems } from "@/lib/dummy-data"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { Heart, MapPin, Star, ShoppingCart, MessageSquare, Phone } from "lucide-react"
import { useChat } from "@/lib/chat-context"
import { useRouter } from "next/navigation"

export default function ProductDetailPage() {
  const params = useParams()
  const id = params.id
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)

  const [addedToCart, setAddedToCart] = useState(false)
  const { addToCart } = useCart()
  const { user } = useAuth()
  const { startConversation } = useChat()
  const router = useRouter()

  useEffect(() => {
    let ignore = false
    async function load() {
      try {
        const res = await fetch(`/api/listings/${id}`, { cache: "no-store" })
        const json = await res.json()
        if (!ignore && json.ok) {
          const it = json.data
          setProduct({
            id: it._id,
            title: it.title,
            category: it.category,
            price: it.price,
            originalPrice: it.originalPrice,
            images: (it.images && it.images.length > 0) ? it.images : ["/placeholder.svg"],
            college: it.college,
            seller: it.seller,
            sellerId: it.sellerId,
            sellerPhone: it.sellerPhone,
            description: it.description,
            rating: it.rating ?? 0,
            reviews: it.reviews ?? 0,
            quantity: it.quantity ?? 1,
            postedAt: it.postedAt ? new Date(it.postedAt) : new Date(it.createdAt || Date.now()),
          })
          setLoading(false)
          return
        }
      } catch {
        // Handle network errors silently
      }
      // Fallback to dummy data if API fails or returns 404
      const fallback = dummyItems.find((d) => String(d.id) === String(id))
      if (!ignore) setProduct(fallback || null)
      if (!ignore) setLoading(false)
    }
    load()
    return () => {
      ignore = true
    }
  }, [id])

  if (loading && !product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground">Loading...</div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Product not found</h1>
            <Link href="/products" className="text-accent hover:underline">
              Back to products
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const handleAddToCart = () => {
    if (!user) {
      alert("Please login to add items to cart")
      return
    }
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.images?.[0] || "/placeholder.svg",
    })
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const handleChatWithSeller = () => {
    if (!user) {
      alert("Please login to chat with seller")
      return
    }
    const phone = product.sellerPhone || "+91 9999999999"
    startConversation(product.sellerId || product.id, product.seller, phone, product.id, product.title)
    router.push("/chat")
  }

  const handleCallSeller = () => {
    const phone = product.sellerPhone || "+91 9999999999"
    window.location.href = `tel:${phone}`
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-accent">
            Home
          </Link>
          {" / "}
          <Link href="/products" className="hover:text-accent">
            Products
          </Link>
          {" / "}
          <span>{product.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Image */}
          <div className="lg:col-span-2">
            <div className="bg-muted rounded-lg overflow-hidden mb-6">
              {product.images?.[0] && (product.images[0].startsWith('data:') || product.images[0].startsWith('/') || !product.images[0].startsWith('http')) ? (
                <img 
                  src={product.images[0] || "/placeholder.svg"} 
                  alt={product.title} 
                  className="w-full h-96 object-cover"
                  onError={(e) => {
                    e.target.src = "/placeholder.svg"
                  }}
                />
              ) : (
                <Image 
                  src={product.images?.[0] || "/placeholder.svg"} 
                  alt={product.title} 
                  width={800} 
                  height={384} 
                  className="w-full h-96 object-cover"
                  unoptimized
                  onError={(e) => {
                    e.target.src = "/placeholder.svg"
                  }}
                />
              )}
            </div>

            {/* Product Info */}
            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="inline-block px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm font-semibold mb-3">
                    {product.category}
                  </span>
                  <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
                </div>
                <button onClick={() => setIsFavorite(!isFavorite)} className="p-2 hover:bg-muted rounded-lg transition">
                  <Heart className={`w-6 h-6 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                </button>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
                <div className="flex items-center gap-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-accent text-accent" : "text-muted-foreground"}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="font-semibold text-lg mb-3">Description</h2>
                <p className="text-foreground/80 leading-relaxed">{product.description}</p>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-5 h-5" />
                <span>{product.college}</span>
              </div>
            </div>
          </div>

          {/* Sidebar - Seller & CTA */}
          <div className="lg:col-span-1">
            {/* Price Card */}
            <div className="bg-card rounded-lg p-6 border border-border mb-6 sticky top-20">
              <div className="mb-6">
                <p className="text-muted-foreground text-sm mb-2">Price</p>
                <p className="text-4xl font-bold text-primary">₹{product.price}</p>
              </div>



              <button
                onClick={handleAddToCart}
                className={`w-full px-4 py-3 font-bold rounded-lg transition flex items-center justify-center gap-2 mb-3 ${
                  addedToCart ? "bg-green-500 text-white" : "bg-accent text-accent-foreground hover:opacity-90"
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                {addedToCart ? "Added to Cart!" : "Add to Cart"}
              </button>

              <button 
                onClick={handleChatWithSeller}
                className="w-full px-4 py-3 bg-accent text-accent-foreground font-bold rounded-lg hover:opacity-90 transition mb-3 flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-5 h-5" />
                Chat with Seller
              </button>
              <button 
                onClick={handleCallSeller}
                className="w-full px-4 py-3 border-2 border-accent text-accent font-bold rounded-lg hover:bg-accent/10 transition flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Call Seller
              </button>
            </div>

            {/* Seller Info */}
            <div className="bg-card rounded-lg p-6 border border-border">
              <h3 className="font-bold text-lg mb-4">Seller Information</h3>

              <div className="mb-6">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-accent-foreground font-bold text-lg mb-3">
                  {product.seller?.charAt(0) || "S"}
                </div>
                <p className="font-semibold">{product.seller || "Seller"}</p>
                <p className="text-sm text-muted-foreground">Member since 2023</p>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Response Rate</span>
                  <span className="font-semibold">95%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Items Sold</span>
                  <span className="font-semibold">24</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rating</span>
                  <span className="font-semibold">4.8/5</span>
                </div>
              </div>

              <button className="w-full mt-4 px-4 py-2 border border-border rounded-lg hover:bg-muted transition text-sm font-medium">
                View Seller Profile
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}



