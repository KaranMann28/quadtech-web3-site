"use client"

import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { MapPin, Users, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const offices = [
  {
    country: "United States",
    city: "Baltimore, Maryland",
    address: "7677 Canton Center Drive, Baltimore MD 21224",
    description: "Our primary US headquarters serving clients across North America"
  },
  {
    country: "Canada", 
    city: "Mississauga, Ontario",
    address: "165 Dundas Street West, Mississauga, Ontario L5B 2N6, Canada",
    description: "Canadian headquarters providing localized support and expertise"
  }
]

const remoteLocations = [
  "California",
  "Greater Toronto Area", 
  "Montreal",
  "Calgary"
]

export function AboutTeam() {
  return (
    <section className="py-24 bg-gradient-to-b from-muted/20 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Team Introduction */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Our Global Team</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Highly skilled and dedicated professionals with extensive experience in the Telecom & IT industry, 
            working together across multiple locations to deliver exceptional results.
          </p>
        </motion.div>

        {/* Office Locations */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-12">
            <span className="gradient-text">Office Locations</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {offices.map((office, index) => (
              <motion.div
                key={office.city}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
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
                        <CardTitle className="text-xl">{office.city}</CardTitle>
                        <CardDescription className="text-accent font-semibold">
                          {office.country}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{office.address}</p>
                    <p className="text-sm text-muted-foreground">{office.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Remote Team */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="glass-morphism rounded-3xl p-8 md:p-12 text-center">
            <div className="relative mb-6">
              <Users className="h-16 w-16 text-accent mx-auto" />
              <div className="absolute inset-0 bg-accent/20 rounded-full blur-xl" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-6">
              <span className="gradient-text">Remote Work Excellence</span>
            </h3>
            <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
              We&apos;ve embraced the flexibility of remote work, leveraging talented teams across multiple locations 
              to provide comprehensive coverage and expertise.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {remoteLocations.map((location, index) => (
                <motion.div
                  key={location}
                  className="bg-accent/10 rounded-lg p-4 border border-accent/20"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <span className="text-accent font-semibold">{location}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="glass-morphism rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Work with Our Expert Team?
            </h3>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Connect with our experienced professionals and discover how our global team 
              can deliver innovative solutions tailored to your specific needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="gradient" size="lg" asChild>
                <Link href="/contact" className="flex items-center">
                  Contact Our Team
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/services">View Our Services</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
