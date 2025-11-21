"use client"

import React from "react"
import { 
  IconAntenna, 
  IconNetwork, 
  IconWifi, 
  IconShield, 
  IconBuildingSkyscraper 
} from "@tabler/icons-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"

// Service data with icons and descriptions
const services = [
  {
    id: "5g-wireless",
    icon: IconAntenna,
    title: "5G Fixed Wireless Access",
    description: "Deploy high-speed internet using LTE/5G for last-mile connectivity.",
    isWeb3Ready: true,
  },
  {
    id: "fiber-optic",
    icon: IconNetwork,
    title: "Fiber Optic Infrastructure",
    description: "Plan and install FTTH/FTTO systems, including trenching, splicing, testing.",
    isWeb3Ready: false,
  },
  {
    id: "indoor-wireless",
    icon: IconWifi,
    title: "Indoor Wireless & DAS",
    description: "Improve indoor signal strength with small-cell and distributed antenna systems.",
    isWeb3Ready: true,
  },
  {
    id: "site-safety",
    icon: IconShield,
    title: "Site Safety & Compliance",
    description: "Conduct EMF/RF audits and Safety Code 6 validation.",
    isWeb3Ready: false,
  },
  {
    id: "smart-building",
    icon: IconBuildingSkyscraper,
    title: "Smart Building Integration",
    description: "Enable IoT connectivity and private 5G inside commercial buildings.",
    isWeb3Ready: true,
  },
]

/**
 * ServiceCard Component
 * Individual service card with icon, title, description, and optional Web3 badge
 */
interface ServiceCardProps {
  service: typeof services[0]
}

function ServiceCard({ service }: ServiceCardProps) {
  const Icon = service.icon

  return (
    <article className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:scale-105 hover:border-accent hover:shadow-lg dark:bg-card dark:border-border dark:hover:border-accent">
      {/* Web3 Ready Badge */}
      {service.isWeb3Ready && (
        <div className="absolute top-4 right-4">
          <span className="inline-flex items-center rounded-full bg-gradient-to-r from-accent to-primary px-2.5 py-0.5 text-xs font-medium text-white">
            Web3 Ready
          </span>
        </div>
      )}

      {/* Icon */}
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors duration-300 group-hover:bg-accent/20 dark:bg-accent/20 dark:group-hover:bg-accent/30">
        <Icon className="h-6 w-6" />
      </div>

      {/* Content */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground dark:text-foreground">
          {service.title}
        </h3>
        <p className="text-sm text-muted-foreground dark:text-muted-foreground leading-relaxed">
          {service.description}
        </p>
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-accent/5 to-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-accent/10 dark:to-primary/10" />
    </article>
  )
}

/**
 * ServicesSection Component
 * Main services section with theme toggle and responsive grid of service cards
 */
export function ServicesSection() {
  return (
    <section className="py-16 bg-background dark:bg-background transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header with Theme Toggle */}
        <div className="mb-12 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="text-center sm:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-foreground dark:text-foreground sm:text-4xl">
              Our Services
            </h2>
            <p className="mt-2 text-lg text-muted-foreground dark:text-muted-foreground">
              Comprehensive telecom solutions for modern connectivity needs
            </p>
          </div>
          <ThemeToggle />
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground dark:text-muted-foreground mb-4">
            Ready to transform your network infrastructure?
          </p>
          <button className="inline-flex items-center rounded-lg bg-gradient-to-r from-accent to-primary px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 dark:focus:ring-offset-background">
            Get Started Today
            <svg
              className="ml-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}
