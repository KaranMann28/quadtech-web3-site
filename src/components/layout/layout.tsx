import React from "react"
import { Header } from "./header"
import { Footer } from "./footer"
import { AIChatbot } from "@/components/ui/ai-chatbot"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <Footer />
      <AIChatbot />
    </div>
  )
}
