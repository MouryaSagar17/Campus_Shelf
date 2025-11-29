"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function VerifyEmailPage() {
  const params = useSearchParams()
  const router = useRouter()
  const token = params.get("token") || ""
  const [status, setStatus] = useState("verifying")

  useEffect(() => {
    let ignore = false
    async function run() {
      try {
        const res = await fetch("/api/auth/verify-email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token }) })
        const json = await res.json()
        if (!ignore) setStatus(json.ok ? "ok" : "error")
        if (json.ok) setTimeout(() => router.push("/"), 1200)
      } catch {
        if (!ignore) setStatus("error")
      }
    }
    if (token) run()
    else setStatus("error")
    return () => {
      ignore = true
    }
  }, [token, router])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-lg p-8 border border-border text-center">
            {status === "verifying" && <p className="text-muted-foreground">Verifying your email...</p>}
            {status === "ok" && <p className="text-green-600 font-semibold">Email verified! Redirecting...</p>}
            {status === "error" && <p className="text-red-600 font-semibold">Invalid or expired token.</p>}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}






