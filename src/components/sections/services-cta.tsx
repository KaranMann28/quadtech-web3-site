"use client"

import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ServicesCTA() {
  return (
    <section className="py-24 bg-gradient-to-b from-muted/20 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="glass-morphism rounded-3xl p-8 md:p-12 max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Network Infrastructure?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Get a free consultation with our network experts and discover how we can 
              optimize your communication infrastructure for maximum performance, reliability, and efficiency.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button variant="gradient" size="lg" asChild>
                <Link href="/contact" className="flex items-center">
                  Get Free Consultation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/about">Learn About Us</Link>
              </Button>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 pt-8 border-t border-border/20">
              <div className="flex items-center justify-center space-x-3">
                <div className="relative">
                  <Phone className="h-6 w-6 text-accent" />
                  <div className="absolute inset-0 bg-accent/20 rounded-full blur-lg" />
                </div>
                <div className="text-left">
                  <div className="text-sm text-muted-foreground">Call Us</div>
                  <div className="font-semibold">+1 (555) 123-4567</div>
                </div>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <div className="relative">
                  <Mail className="h-6 w-6 text-accent" />
                  <div className="absolute inset-0 bg-accent/20 rounded-full blur-lg" />
                </div>
                <div className="text-left">
                  <div className="text-sm text-muted-foreground">Email Us</div>
                  <div className="font-semibold">info@quadtechsolutions.com</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
