import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"
import { CartProvider } from "@/lib/cart-context"
import { FavoritesProvider } from "@/lib/favorites-context"
import { ChatProvider } from "@/lib/chat-context"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata = {
  title: "CampusShelf",
  description: "Buy & Sell Student Materials",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider>
            <CartProvider>
              <FavoritesProvider>
                <ChatProvider>
                  {children}
                </ChatProvider>
              </FavoritesProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
