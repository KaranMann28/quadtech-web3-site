"use client"

import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { 
  Network, 
  Radio, 
  Cable, 
  Settings, 
  Wrench, 
  Users,
  ArrowRight 
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const services = [
  {
    icon: Network,
    title: "Network Design & Architecture",
    description: "Custom network solutions designed from the ground up to meet your specific requirements and scale with your business growth.",
    features: ["Scalable Infrastructure", "Future-Proof Design", "Cost Optimization"],
    href: "/services#network-design"
  },
  {
    icon: Radio,
    title: "Wireless Solutions",
    description: "Comprehensive wireless network implementation including 5G, LTE, Wi-Fi 6, and IoT connectivity solutions.",
    features: ["5G Implementation", "Wi-Fi 6 Deployment", "IoT Integration"],
    href: "/services#wireless"
  },
  {
    icon: Cable,
    title: "Wireline Infrastructure",
    description: "Robust fiber optic and copper network installations with high-speed data transmission capabilities.",
    features: ["Fiber Optic Networks", "High-Speed Data", "Reliable Connections"],
    href: "/services#wireline"
  },
  {
    icon: Settings,
    title: "Network Optimization",
    description: "Performance tuning and optimization services to maximize your network efficiency and reduce operational costs.",
    features: ["Performance Tuning", "Cost Reduction", "Efficiency Gains"],
    href: "/services#optimization"
  },
  {
    icon: Wrench,
    title: "Troubleshooting & Support",
    description: "24/7 network monitoring, rapid issue resolution, and proactive maintenance to ensure maximum uptime.",
    features: ["24/7 Monitoring", "Rapid Response", "Proactive Maintenance"],
    href: "/services#troubleshooting"
  },
  {
    icon: Users,
    title: "Consulting Services",
    description: "Expert consultation on network strategy, technology selection, and digital transformation initiatives.",
    features: ["Strategic Planning", "Technology Selection", "Digital Transformation"],
    href: "/services#consulting"
  }
]

export function Services() {
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
            <span className="gradient-text">Our Services</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive telecom solutions designed to transform your communication infrastructure 
            and drive business success through cutting-edge technology.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card 
                variant="glass" 
                className="h-full group hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <CardHeader>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="relative">
                      <service.icon className="h-12 w-12 text-accent group-hover:text-primary transition-colors duration-300" />
                      <div className="absolute inset-0 bg-accent/20 rounded-full blur-lg group-hover:bg-primary/20 transition-all duration-300" />
                    </div>
                  </div>
                  <CardTitle className="text-xl group-hover:text-accent transition-colors duration-300">
                    {service.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-accent rounded-full mr-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" size="sm" className="w-full group" asChild>
                    <Link href={service.href} className="flex items-center justify-center">
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

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
              Ready to Transform Your Network?
            </h3>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Get a free consultation with our network experts and discover how we can 
              optimize your communication infrastructure for maximum performance and efficiency.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="gradient" size="lg" asChild>
                <Link href="/contact" className="group">
                  Get Free Consultation
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/services">View All Services</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
