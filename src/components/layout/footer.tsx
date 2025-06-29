import React from "react"
import Link from "next/link"
import { Zap, Mail, Phone, MapPin, Linkedin, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"

const navigation = {
  main: [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Why Us", href: "/why-us" },
    { name: "Contact", href: "/contact" },
  ],
  services: [
    { name: "Network Design", href: "/services#network-design" },
    { name: "Wireless Solutions", href: "/services#wireless" },
    { name: "Wireline Infrastructure", href: "/services#wireline" },
    { name: "Network Optimization", href: "/services#optimization" },
    { name: "Troubleshooting", href: "/services#troubleshooting" },
  ],
  social: [
    {
      name: "LinkedIn",
      href: "#",
      icon: Linkedin,
    },
    {
      name: "Twitter",
      href: "#",
      icon: Twitter,
    },
  ],
}

export function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center space-x-2 group mb-4">
                <div className="relative">
                  <Zap className="h-8 w-8 text-accent group-hover:text-primary transition-colors duration-300" />
                  <div className="absolute inset-0 bg-accent/20 rounded-full blur-lg group-hover:bg-primary/20 transition-all duration-300" />
                </div>
                <span className="text-xl font-bold gradient-text">
                  QUADTECH SOLUTIONS
                </span>
              </Link>
              <p className="text-muted-foreground mb-6 max-w-md">
                Unleashing the potential of Telecom. We specialize in Wireless and Wireline Network Design, 
                Optimization, Switching, and Troubleshooting to transform your communication infrastructure.
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4 text-accent" />
                  <span>info@quadtechsolutions.com</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4 text-accent" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 text-accent" />
                  <span>Your City, State 12345</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                Quick Links
              </h3>
              <ul className="space-y-2">
                {navigation.main.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-accent transition-colors duration-300"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                Services
              </h3>
              <ul className="space-y-2">
                {navigation.services.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-accent transition-colors duration-300"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-border py-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Stay Updated
              </h3>
              <p className="text-sm text-muted-foreground">
                Get the latest insights on telecom technology and industry trends.
              </p>
            </div>
            <div className="flex space-x-4">
              <Button variant="outline" size="sm">
                Subscribe to Newsletter
              </Button>
              <Button variant="gradient" size="sm" asChild>
                <Link href="/contact">Get Free Consultation</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-border py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <p className="text-sm text-muted-foreground">
                © 2024 QuadTech Solutions. All rights reserved.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {navigation.social.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-muted-foreground hover:text-accent transition-colors duration-300"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
