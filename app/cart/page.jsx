"use client"

import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { Trash2, ShoppingBag } from "lucide-react"
import { useRouter } from "next/navigation"

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart()
  const { user } = useAuth()
  const router = useRouter()

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-2xl font-bold mb-2">Please Login</h1>
            <p className="text-muted-foreground mb-6">You need to login to view your cart</p>
            <Link href="/login" className="px-6 py-2 bg-accent text-accent-foreground font-bold rounded-lg hover:opacity-90 transition">
              Go to Login
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        {cart.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground text-lg mb-6">Your cart is empty</p>
            <Link href="/products" className="px-6 py-2 bg-accent text-accent-foreground font-bold rounded-lg hover:opacity-90 transition">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-lg border border-border overflow-hidden">
                {cart.map((item) => (
                  <div key={item.id} className="p-6 border-b border-border last:border-b-0 flex gap-4">
                    {/* Item Image */}
                    <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                      <img src={item.image || "/placeholder.svg"} alt={item.title} className="w-full h-full object-cover" />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                      <p className="text-primary font-bold text-lg mb-4">₹{item.price}</p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 border border-border rounded-lg hover:bg-muted transition">
                          -
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-12 text-center border border-border rounded-lg py-1"
                        />
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 border border-border rounded-lg hover:bg-muted transition">
                          +
                        </button>
                      </div>
                    </div>

                    {/* Item Total & Remove */}
                    <div className="text-right flex flex-col justify-between">
                      <p className="font-bold text-lg">₹{item.price * item.quantity}</p>
                      <button onClick={() => removeFromCart(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={clearCart} className="mt-4 px-4 py-2 text-red-500 border border-red-500 rounded-lg hover:bg-red-50 transition font-medium">
                Clear Cart
              </button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg border border-border p-6 sticky top-20">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6 pb-6 border-b border-border">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold">₹{cartTotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-semibold">₹0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-semibold">₹{Math.round(cartTotal * 0.18)}</span>
                  </div>
                </div>

                <div className="flex justify-between mb-6 text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">₹{cartTotal + Math.round(cartTotal * 0.18)}</span>
                </div>

                <button onClick={() => router.push("/payment")} className="w-full px-4 py-3 bg-accent text-accent-foreground font-bold rounded-lg hover:opacity-90 transition mb-3">
                  Proceed to Checkout
                </button>

                <Link href="/products" className="block text-center px-4 py-3 border border-accent text-accent font-bold rounded-lg hover:bg-accent/10 transition">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}




