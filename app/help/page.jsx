"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

const faqs = [
  {
    question: "How do I post an ad?",
    answer:
      "Click on 'Sell' in the navigation menu, fill in the product details, upload images, and click 'Post Ad'. Your listing will be live immediately.",
  },
  {
    question: "How do I contact a seller?",
    answer:
      "Click on any product to view details, then click 'Contact Seller'. You can start a chat conversation with the seller directly.",
  },
  {
    question: "Is it safe to buy on CampusShelf?",
    answer:
      "Yes, we recommend meeting in public places on campus, verifying seller information, and using secure payment methods. Always check seller ratings and reviews.",
  },
  {
    question: "Can I edit my listing?",
    answer:
      "Yes, go to 'My Listings' in your profile, select the item, and click 'Edit'. You can update price, description, and images.",
  },
  {
    question: "How do I delete a listing?",
    answer:
      "Go to 'My Listings', find the item you want to remove, and click 'Delete'. The listing will be removed immediately.",
  },
  {
    question: "What payment methods are accepted?",
    answer:
      "We support WhatsApp Payment, Credit Card, Debit Card, UPI, and Net Banking. Choose your preferred method during checkout.",
  },
]

export default function HelpPage() {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8">Help & FAQ</h1>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-card border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-4 hover:bg-muted transition"
              >
                <h3 className="font-semibold text-foreground text-left">{faq.question}</h3>
                <ChevronDown className={`w-5 h-5 transition-transform ${openIndex === index ? "rotate-180" : ""}`} />
              </button>

              {openIndex === index && (
                <div className="px-4 py-3 border-t border-border bg-muted/50">
                  <p className="text-foreground">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-accent/10 border-2 border-accent rounded-lg">
          <h2 className="text-xl font-bold mb-2">Still need help?</h2>
          <p className="text-foreground/80 mb-4">
            Can't find the answer you're looking for? Please contact our support team.
          </p>
          <a href="mailto:support@campusshelf.com" className="inline-block px-6 py-2 bg-accent text-accent-foreground font-semibold rounded-lg hover:opacity-90 transition">
            Contact Support
          </a>
        </div>
      </main>

      <Footer />
    </div>
  )
}






