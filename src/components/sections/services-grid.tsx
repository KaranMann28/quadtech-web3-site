"use client"

import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { 
  Network, 
  Radio, 
  Cable, 
  TestTube, 
  BarChart3,
  ArrowRight 
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const services = [
  {
    id: "network-design",
    icon: Network,
    title: "Network Design",
    description: "Our network design services are tailored to create robust, scalable, and future-proof infrastructure solutions that meet your organization's evolving requirements. Drawing on our expertise in network architecture and technology trends, we design customized solutions that optimize performance, enhance security, and maximize efficiency. Whether you're building a new network from the ground up or upgrading an existing one, our team will collaborate closely with you to deliver a design that exceeds expectations.",
    features: ["Scalable Infrastructure", "Future-Proof Design", "Cost Optimization"]
  },
  {
    id: "network-consulting",
    icon: Radio,
    title: "Network Consulting/Pre-Sales Planning",
    description: "Our network consulting and pre-sales planning services are designed to provide you with comprehensive guidance and strategic insights to help you make informed decisions about your network infrastructure. Our experienced consultants work closely with you to assess your current needs, understand your goals, and develop customized plans that align with your objectives. From evaluating technology options to forecasting capacity requirements, we ensure that every aspect of your network strategy is optimized for success.",
    features: ["Strategic Planning", "Technology Assessment", "Capacity Forecasting"]
  },
  {
    id: "network-construction",
    icon: Cable,
    title: "Network Construction and Deployment",
    description: "With our network construction and deployment services, we bring your network design to life with precision and efficiency. Our experienced team manages every aspect of the implementation process, from procuring equipment to coordinating installation and testing. Whether it's deploying new hardware, laying fiber optic cables, or configuring network switches, we ensure that your infrastructure is built to the highest standards and delivered on time and within budget.",
    features: ["Precision Implementation", "Equipment Procurement", "Quality Assurance"]
  },
  {
    id: "network-testing",
    icon: TestTube,
    title: "Network Testing and Acceptance",
    description: "Our network testing and acceptance services are designed to verify your network infrastructure's performance, reliability, and security before deployment. Using advanced testing methodologies and industry-leading tools, we conduct rigorous testing to identify and address any potential issues or vulnerabilities. From throughput testing to security audits, we leave no stone unturned to ensure that your network meets the highest standards of quality and reliability.",
    features: ["Performance Verification", "Security Audits", "Quality Standards"]
  },
  {
    id: "network-performance",
    icon: BarChart3,
    title: "Network Performance and Management",
    description: "Our network performance and management services provide ongoing monitoring, optimization, and support to keep your network running smoothly and efficiently. Leveraging advanced analytics and proactive monitoring tools, we continuously assess network performance, identify bottlenecks, and implement optimizations to maximize throughput and minimize downtime. Whether it's troubleshooting issues, implementing performance enhancements, or providing comprehensive reporting, our team is dedicated to ensuring that your network operates at peak performance at all times.",
    features: ["Continuous Monitoring", "Performance Optimization", "Proactive Support"]
  }
]

export function ServicesGrid() {
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
            <span className="gradient-text">Comprehensive Solutions</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From initial design to ongoing management, we provide end-to-end telecom solutions 
            that drive your business forward with cutting-edge technology and expert support.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card 
                variant="glass" 
                className="h-full group hover:scale-105 transition-all duration-300"
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
                  <CardDescription className="text-muted-foreground text-sm leading-relaxed">
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
                    <Link href={`/contact?service=${service.id}`} className="flex items-center justify-center">
                      Get Quote
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
