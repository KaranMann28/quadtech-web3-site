import React from "react"
import { Layout } from "@/components/layout/layout"
import { ServicesSection } from "@/components/sections/services-section"

export default function ServicesDemoPage() {
  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="pt-24 pb-12 bg-gradient-to-br from-background via-background to-accent/5 dark:from-background dark:via-background dark:to-accent/10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground dark:text-foreground sm:text-6xl">
              Services Demo
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground dark:text-muted-foreground max-w-2xl mx-auto">
              Showcasing our new services section with dark/light mode support and responsive design.
            </p>
          </div>
        </section>

        {/* Services Section */}
        <ServicesSection />
      </div>
    </Layout>
  )
}
