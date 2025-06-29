"use client"

import React from "react"
import { motion } from "framer-motion"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const offices = [
  {
    title: "US OFFICE",
    address: "7677 Canton Center Drive, Baltimore MD 21224",
    country: "United States",
    phone: "+1 (555) 123-4567",
    email: "us@quadtechsolutions.com"
  },
  {
    title: "CANADA OFFICE", 
    address: "165 Dundas Street West, Mississauga, Ontario L5B 2N6, Canada",
    country: "Canada",
    phone: "+1 (555) 123-4568",
    email: "ca@quadtechsolutions.com"
  }
]

export function ContactInfo() {
  return (
    <section className="py-24 bg-gradient-to-b from-muted/20 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">Our Locations</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            With offices in both the United States and Canada, we provide localized support 
            and expertise to meet your diverse telecom infrastructure needs.
          </p>
        </motion.div>

        {/* Office Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {offices.map((office, index) => (
            <motion.div
              key={office.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card variant="glass" className="h-full hover:scale-105 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="relative">
                      <MapPin className="h-8 w-8 text-accent" />
                      <div className="absolute inset-0 bg-accent/20 rounded-full blur-lg" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{office.title}</CardTitle>
                      <CardDescription className="text-accent font-semibold">
                        {office.country}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <p className="text-muted-foreground">{office.address}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <p className="text-muted-foreground">{office.phone}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <p className="text-muted-foreground">{office.email}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Business Hours & Additional Info */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Business Hours */}
          <Card variant="glass" className="hover:scale-105 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center space-x-3 mb-4">
                <div className="relative">
                  <Clock className="h-8 w-8 text-accent" />
                  <div className="absolute inset-0 bg-accent/20 rounded-full blur-lg" />
                </div>
                <CardTitle className="text-xl">Business Hours</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Monday - Friday</span>
                <span className="font-semibold">8:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Saturday</span>
                <span className="font-semibold">9:00 AM - 2:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sunday</span>
                <span className="font-semibold">Emergency Only</span>
              </div>
              <div className="pt-3 border-t border-border/20">
                <p className="text-sm text-accent font-semibold">
                  24/7 Emergency Support Available
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Response Times */}
          <Card variant="glass" className="hover:scale-105 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center space-x-3 mb-4">
                <div className="relative">
                  <Mail className="h-8 w-8 text-accent" />
                  <div className="absolute inset-0 bg-accent/20 rounded-full blur-lg" />
                </div>
                <CardTitle className="text-xl">Response Times</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email Inquiries</span>
                <span className="font-semibold">Within 24 hours</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phone Calls</span>
                <span className="font-semibold">Same day</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Emergency Support</span>
                <span className="font-semibold">Within 1 hour</span>
              </div>
              <div className="pt-3 border-t border-border/20">
                <p className="text-sm text-accent font-semibold">
                  Free Consultation Available
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
