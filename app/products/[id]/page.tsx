"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { dummyItems } from "@/lib/dummy-data"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { useFavorites } from "@/lib/favorites-context"
import { useChat } from "@/lib/chat-context"
import { Heart, MapPin, Star, ShoppingCart } from "lucide-react"

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = Number.parseInt(params.id as string)
  const product = dummyItems.find((item) => item.id === id)
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const { addToCart } = useCart()
  const { user } = useAuth()
  const { isFavorite, addFavorite, removeFavorite } = useFavorites()
  const { startConversation, setCurrentConversation } = useChat()
  const favorited = isFavorite(id)

  const handleFavoriteClick = () => {
    if (favorited) {
      removeFavorite(id)
    } else {
      addFavorite(id)
    }
  }

  const handleChatWithSeller = () => {
    if (!user) {
      alert("Please login to chat with seller")
      return
    }
    const conversation = startConversation(
      product!.sellerId,
      product!.seller,
      product!.phone,
      product!.id,
      product!.title,
    )
    setCurrentConversation(conversation)
    router.push("/chat")
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
      image: product.image,
    })
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
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
              <img src={product.image || "/placeholder.svg"} alt={product.title} className="w-full h-96 object-cover" />
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
                <button onClick={handleFavoriteClick} className="p-2 hover:bg-muted rounded-lg transition">
                  <Heart className={`w-6 h-6 ${favorited ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                </button>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
                <div className="flex items-center gap-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating) ? "fill-accent text-accent" : "text-muted-foreground"
                      }`}
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

              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">Quantity</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 border border-border rounded-lg hover:bg-muted transition"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                    className="w-12 text-center border border-border rounded-lg py-2"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 border border-border rounded-lg hover:bg-muted transition"
                  >
                    +
                  </button>
                </div>
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
                className="w-full px-4 py-3 bg-accent text-accent-foreground font-bold rounded-lg hover:opacity-90 transition mb-3"
              >
                Chat with Seller
              </button>
              <button className="w-full px-4 py-3 border-2 border-accent text-accent font-bold rounded-lg hover:bg-accent/10 transition">
                Call Seller
              </button>
            </div>

            {/* Seller Info */}
            <div className="bg-card rounded-lg p-6 border border-border">
              <h3 className="font-bold text-lg mb-4">Seller Information</h3>

              <div className="mb-6">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-accent-foreground font-bold text-lg mb-3">
                  {product.seller.charAt(0)}
                </div>
                <p className="font-semibold">{product.seller}</p>
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
