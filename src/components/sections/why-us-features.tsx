"use client"

import React from "react"
import { motion } from "framer-motion"
import { Heart, Award, Globe } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    title: "PASSIONATE",
    icon: Heart,
    description: "At Quad Tech, we're more than just a company – we're a team of passionate individuals dedicated to driving growth through innovative Engineering Infrastructure Solutions. Our commitment to excellence and innovation fuels everything we do, ensuring that our clients receive the highest quality service and solutions tailored to their unique needs.",
    image: "/api/placeholder/400/300" // Placeholder for construction workers image
  },
  {
    title: "PROFESSIONAL", 
    icon: Award,
    description: "Our team of engineers embodies professionalism at its finest. Highly skilled and dedicated professionals with years of experience in the Telecom & IT industry, they bring a wealth of knowledge and expertise to every project. With a focus on delivering results that exceed expectations, our professionals uphold the highest standards of professionalism, integrity, and reliability in all aspects of their work.",
    image: "/api/placeholder/400/300" // Placeholder for consulting/professional image
  },
  {
    title: "US CANADA NETWORK",
    icon: Globe,
    description: "Quad Tech offers comprehensive solutions and services to clients in the US and Canada. With offices in Maryland, California, Toronto, GTA, and Calgary, we provide localized support and expertise to meet diverse needs. Our extensive network ensures seamless communication and collaboration, driving success for clients on both sides of the border.",
    image: "/api/placeholder/400/300" // Placeholder for US/Canada flags image
  }
]

export function WhyUsFeatures() {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Why Us</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Three core pillars that define our approach and set us apart in the industry
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="space-y-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card variant="glass" className="overflow-hidden hover:scale-105 transition-all duration-300">
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-0 ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                  {/* Content */}
                  <div className={`p-8 md:p-12 flex flex-col justify-center ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                    <CardHeader className="p-0 mb-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="relative">
                          <feature.icon className="h-16 w-16 text-accent" />
                          <div className="absolute inset-0 bg-accent/20 rounded-full blur-xl" />
                        </div>
                      </div>
                      <CardTitle className="text-2xl md:text-3xl font-bold">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <CardDescription className="text-muted-foreground text-lg leading-relaxed">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </div>

                  {/* Image Placeholder */}
                  <div className={`relative min-h-[300px] lg:min-h-[400px] ${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
                      <div className="text-center">
                        <feature.icon className="h-24 w-24 text-accent/50 mx-auto mb-4" />
                        <p className="text-muted-foreground text-sm">
                          {feature.title === "PASSIONATE" && "Construction & Engineering"}
                          {feature.title === "PROFESSIONAL" && "Consulting & Strategy"}
                          {feature.title === "US CANADA NETWORK" && "Global Network Coverage"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
