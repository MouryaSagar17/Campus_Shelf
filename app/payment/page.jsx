"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { MessageCircle, CreditCard, Smartphone, Banknote, ArrowLeft, CheckCircle } from "lucide-react"

export default function PaymentPage() {
  const router = useRouter()
  const { cart, cartTotal, clearCart } = useCart()
  const { user } = useAuth()
  const [selectedMethod, setSelectedMethod] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)

  const totalAmount = cartTotal + Math.round(cartTotal * 0.18)

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Please Login</h1>
            <p className="text-muted-foreground mb-6">You need to login to proceed with payment</p>
            <Link href="/login" className="px-6 py-2 bg-accent text-accent-foreground font-bold rounded-lg hover:opacity-90 transition">
              Go to Login
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-6">Add items to your cart before proceeding to payment</p>
            <Link href="/products" className="px-6 py-2 bg-accent text-accent-foreground font-bold rounded-lg hover:opacity-90 transition">
              Continue Shopping
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const handlePayment = async () => {
    if (!selectedMethod) {
      alert("Please select a payment method")
      return
    }

    setIsProcessing(true)

    try {
      const payload = {
        items: cart.map((i) => ({ listingId: i.id, title: i.title, price: i.price, quantity: i.quantity, image: i.image })),
        subtotal: cartTotal,
        tax: Math.round(cartTotal * 0.18),
        total: totalAmount,
        paymentMethod: selectedMethod,
      }
      const res = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      const json = await res.json()
      if (!json.ok) throw new Error(json.error || "Failed to create order")

      setIsProcessing(false)
      setOrderPlaced(true)
      setTimeout(() => {
        clearCart()
        router.push("/order-confirmation")
      }, 1200)
    } catch (e) {
      setIsProcessing(false)
      alert(e.message || "Payment failed")
    }
  }

  const paymentMethods = [
    { id: "whatsapp", name: "WhatsApp Payment", description: "Pay via WhatsApp - Quick and secure", icon: MessageCircle, color: "bg-green-50 border-green-200 hover:border-green-400", textColor: "text-green-600" },
    { id: "credit-card", name: "Credit Card", description: "Visa, Mastercard, American Express", icon: CreditCard, color: "bg-blue-50 border-blue-200 hover:border-blue-400", textColor: "text-blue-600" },
    { id: "debit-card", name: "Debit Card", description: "All major debit cards accepted", icon: CreditCard, color: "bg-purple-50 border-purple-200 hover:border-purple-400", textColor: "text-purple-600" },
    { id: "upi", name: "UPI", description: "Google Pay, PhonePe, Paytm", icon: Smartphone, color: "bg-orange-50 border-orange-200 hover:border-orange-400", textColor: "text-orange-600" },
    { id: "net-banking", name: "Net Banking", description: "All major banks supported", icon: Banknote, color: "bg-indigo-50 border-indigo-200 hover:border-indigo-400", textColor: "text-indigo-600" },
  ]

  if (orderPlaced) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <CheckCircle className="w-20 h-20 mx-auto mb-4 text-green-500" />
            <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-muted-foreground mb-2">Your order has been placed successfully</p>
            <p className="text-sm text-muted-foreground mb-6">Redirecting to order confirmation...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button onClick={() => router.back()} className="flex items-center gap-2 text-accent hover:opacity-80 transition mb-6 font-medium">
          <ArrowLeft className="w-4 h-4" />
          Back to Cart
        </button>

        <h1 className="text-3xl font-bold mb-8">Select Payment Method</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Methods */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {paymentMethods.map((method) => {
                const Icon = method.icon
                return (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`w-full p-6 border-2 rounded-lg transition text-left ${selectedMethod === method.id ? `${method.color.split(" ")[0]} border-current` : `${method.color} border-current`}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${method.color.split(" ")[0]}`}>
                        <Icon className={`w-6 h-6 ${method.textColor}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1">{method.name}</h3>
                        <p className="text-sm text-muted-foreground">{method.description}</p>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedMethod === method.id ? "bg-accent border-accent" : "border-border"}`}>
                        {selectedMethod === method.id && <div className="w-3 h-3 bg-accent-foreground rounded-full" />}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            {selectedMethod === "whatsapp" && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>WhatsApp Payment:</strong> Click "Pay Now" and you'll be redirected to WhatsApp to complete your payment with our support team.
                </p>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg border border-border p-6 sticky top-20">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6 pb-6 border-b border-border max-h-48 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.title} x {item.quantity}
                    </span>
                    <span className="font-semibold">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6 pb-6 border-b border-border">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">₹{cartTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (18%)</span>
                  <span className="font-semibold">₹{Math.round(cartTotal * 0.18)}</span>
                </div>
              </div>

              <div className="flex justify-between mb-6 text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">₹{totalAmount}</span>
              </div>

              <button onClick={handlePayment} disabled={!selectedMethod || isProcessing} className="w-full px-4 py-3 bg-accent text-accent-foreground font-bold rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed">
                {isProcessing ? "Processing..." : "Pay Now"}
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}




