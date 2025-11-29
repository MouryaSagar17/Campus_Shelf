"use client"

import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CheckCircle, Package } from "lucide-react"

export default function OrderConfirmationPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <CheckCircle className="w-20 h-20 mx-auto mb-6 text-green-500" />
          <h1 className="text-4xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground text-lg mb-8">
            Thank you for your purchase. Your order has been successfully placed.
          </p>

          <div className="bg-card rounded-lg border border-border p-8 mb-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Package className="w-6 h-6 text-accent" />
              <p className="text-lg font-semibold">Order #CS{Math.floor(Math.random() * 100000)}</p>
            </div>

            <div className="space-y-4 text-left mb-6 pb-6 border-b border-border">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Status</span>
                <span className="font-semibold text-green-600">Confirmed</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estimated Delivery</span>
                <span className="font-semibold">3-5 Business Days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Method</span>
                <span className="font-semibold">Completed</span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-6">
              A confirmation email has been sent to your registered email address. You can track your order status
              anytime from your profile.
            </p>

            <div className="space-y-3">
              <Link href="/products" className="block w-full px-6 py-3 bg-accent text-accent-foreground font-bold rounded-lg hover:opacity-90 transition text-center">
                Continue Shopping
              </Link>
              <Link href="/profile" className="block w-full px-6 py-3 border border-accent text-accent font-bold rounded-lg hover:bg-accent/10 transition text-center">
                View My Orders
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}






