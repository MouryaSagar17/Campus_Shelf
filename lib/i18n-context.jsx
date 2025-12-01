"use client"

import { createContext, useContext, useEffect, useState } from "react"

const I18nContext = createContext(undefined)

// Basic English and Hindi translations for main UI strings
const translations = {
  en: {
    "nav.language": "Language",
    "nav.english": "English",
    "nav.hindi": "Hindi",
    "nav.freeShelf": "FREE SHELF",
    "nav.freeShelfTagline": "e-library",
    "nav.browse": "Browse",
    "nav.sell": "Sell",
    "nav.messages": "Messages",
    "nav.cart": "Cart",
    "nav.profile": "Profile",
    "nav.favorites": "Favorites",
    "nav.login": "Login",
    "nav.signup": "Sign Up",

    "home.heroTitle": "Buy & Sell Student Materials",
    "home.heroSubtitle": "Find the best notes and books from your college community",
    "home.latestListings": "Latest Listings",
    "home.viewAll": "View All",
    "home.noItems": "No items found matching your search.",

    "auth.loginTitle": "Welcome Back",
    "auth.loginSubtitle": "Sign in to your CampusShelf account",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.forgotPassword": "Forgot password?",
    "auth.signIn": "Sign In",
    "auth.signingIn": "Signing in...",
    "auth.noAccount": "Don't have an account?",
    "auth.signUp": "Sign up",

    "postAd.title": "Post Your Ad",
    "postAd.subtitle": "Sell your notes or books to fellow students",
    "postAd.postButton": "Post Ad",
    "postAd.posting": "Posting...",

    "profile.myPosts": "My Posts",
    "profile.postNewAd": "Post New Ad",
  },
  hi: {
    "nav.language": "भाषा",
    "nav.english": "अंग्रेज़ी",
    "nav.hindi": "हिन्दी",
    "nav.freeShelf": "फ्री शेल्फ",
    "nav.freeShelfTagline": "ई-लाइब्रेरी",
    "nav.browse": "सभी देखें",
    "nav.sell": "विज्ञापन डालें",
    "nav.messages": "संदेश",
    "nav.cart": "कार्ट",
    "nav.profile": "प्रोफ़ाइल",
    "nav.favorites": "पसंदीदा",
    "nav.login": "लॉगिन",
    "nav.signup": "साइन अप",

    "home.heroTitle": "स्टूडेंट सामग्री खरीदें और बेचें",
    "home.heroSubtitle": "अपने कॉलेज समुदाय से बेहतरीन नोट्स और किताबें पाएं",
    "home.latestListings": "नवीनतम लिस्टिंग",
    "home.viewAll": "सभी देखें",
    "home.noItems": "आपकी खोज से मेल खाती कोई आइटम नहीं मिली।",

    "auth.loginTitle": "वापस स्वागत है",
    "auth.loginSubtitle": "अपने CampusShelf खाते में साइन इन करें",
    "auth.email": "ईमेल",
    "auth.password": "पासवर्ड",
    "auth.forgotPassword": "पासवर्ड भूल गए?",
    "auth.signIn": "साइन इन",
    "auth.signingIn": "साइन इन हो रहा है...",
    "auth.noAccount": "खाता नहीं है?",
    "auth.signUp": "साइन अप करें",

    "postAd.title": "अपना विज्ञापन पोस्ट करें",
    "postAd.subtitle": "अपने नोट्स या किताबें दूसरे छात्रों को बेचें",
    "postAd.postButton": "विज्ञापन पोस्ट करें",
    "postAd.posting": "पोस्ट हो रहा है...",

    "profile.myPosts": "मेरे विज्ञापन",
    "profile.postNewAd": "नया विज्ञापन पोस्ट करें",
  },
}

export function I18nProvider({ children }) {
  const [language, setLanguage] = useState("en")

  useEffect(() => {
    if (typeof window === "undefined") return
    const stored = window.localStorage.getItem("campusshelf_language")
    if (stored === "en" || stored === "hi") {
      setLanguage(stored)
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    window.localStorage.setItem("campusshelf_language", language)
  }, [language])

  const t = (key) => {
    return translations[language]?.[key] ?? translations.en[key] ?? key
  }

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) {
    throw new Error("useI18n must be used within I18nProvider")
  }
  return ctx
}


