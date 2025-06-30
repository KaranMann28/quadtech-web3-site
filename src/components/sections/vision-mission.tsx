"use client"

import React from "react"
import { motion } from "framer-motion"
import { Target, Eye, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function VisionMission() {
  return (
    <section className="py-24 bg-gradient-to-b from-muted/20 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Vision Statement */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            <span className="gradient-text">Our Vision & Mission</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Our vision is straightforward: <span className="text-accent font-semibold">build networks that perform flawlessly</span>
          </p>
        </motion.div>

        {/* Mission Statement Card */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Card variant="glass" className="p-8 md:p-12">
            <div className="text-center">
              <div className="relative mb-6">
                <Target className="h-16 w-16 text-accent mx-auto" />
                <div className="absolute inset-0 bg-accent/20 rounded-full blur-xl" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-6">
                Building Tomorrow&apos;s Networks Today
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-4xl mx-auto">
                We don&apos;t just want to keep up; we want to stay ahead. Our mission is to be the most trusted partner for building <span className="text-accent font-semibold">North America&apos;s most advanced video, voice, and data networks</span>. We&apos;ve earned the trust of our clients by delivering reliable, competitively-priced solutions that exceed expectations. No fluff, no nonsense.
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Core Values Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-12">
            <span className="gradient-text">What Drives Us</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: Eye,
                title: "Exceed Expectations",
                description: "Every time. It&apos;s how we keep clients coming back. We design networks that just work, so our clients can focus on what they do best."
              },
              {
                icon: Zap,
                title: "Precision & Performance",
                description: "We believe in simplicity. A network should work so well that you forget it&apos;s even there. Smart design, executed with precision."
              }
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card variant="glass" className="h-full p-6 hover:scale-105 transition-all duration-300">
                  <CardHeader className="text-center">
                    <div className="relative mb-4">
                      <value.icon className="h-12 w-12 text-accent mx-auto" />
                      <div className="absolute inset-0 bg-accent/20 rounded-full blur-xl" />
                    </div>
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground text-center">
                      {value.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="text-lg text-muted-foreground mb-6">
            At QuadTech, we&apos;re driven by a simple idea: <span className="text-accent font-semibold">Excellence in every connection</span>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
