import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"
import { CartProvider } from "@/lib/cart-context"
import { FavoritesProvider } from "@/lib/favorites-context"
import { ChatProvider } from "@/lib/chat-context"
import { LocationProvider } from "@/lib/location-context"
import { ThemeProvider } from "@/components/theme-provider"
import { I18nProvider } from "@/lib/i18n-context"

export const metadata = {
  title: "CampusShelf",
  description: "Buy & Sell Student Materials",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <I18nProvider>
            <LocationProvider>
              <AuthProvider>
                <CartProvider>
                  <FavoritesProvider>
                    <ChatProvider>
                      {children}
                    </ChatProvider>
                  </FavoritesProvider>
                </CartProvider>
              </AuthProvider>
            </LocationProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
