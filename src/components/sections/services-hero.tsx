"use client"

import React from "react"
import { motion } from "framer-motion"
import { Network, Zap, Settings } from "lucide-react"

export function ServicesHero() {
  return (
    <section className="relative py-24 bg-gradient-to-br from-background via-background to-primary/10 overflow-hidden">
      {/* Geometric Pattern Overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.4'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0">
        {[
          { icon: Network, x: "10%", y: "20%", delay: 0 },
          { icon: Zap, x: "80%", y: "30%", delay: 0.5 },
          { icon: Settings, x: "15%", y: "70%", delay: 1 },
        ].map((element, index) => (
          <motion.div
            key={index}
            className="absolute"
            style={{ left: element.x, top: element.y }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: element.delay, duration: 1 }}
          >
            <div className="floating">
              <div className="relative">
                <element.icon className="h-12 w-12 text-accent/30" />
                <div className="absolute inset-0 bg-accent/10 rounded-full blur-xl" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">Our Services</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Comprehensive <span className="text-accent font-semibold">Telecom & IT Solutions</span> designed to 
            transform your communication infrastructure and drive business success through cutting-edge technology.
          </p>
        </motion.div>

        {/* Service Categories */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          {[
            {
              title: "Network Design",
              description: "Custom solutions from ground up",
              icon: Network
            },
            {
              title: "Optimization",
              description: "Performance tuning & efficiency",
              icon: Zap
            },
            {
              title: "Support",
              description: "24/7 monitoring & troubleshooting",
              icon: Settings
            }
          ].map((category, index) => (
            <motion.div
              key={category.title}
              className="glass-morphism rounded-2xl p-6 hover:scale-105 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
            >
              <div className="relative mb-4">
                <category.icon className="h-12 w-12 text-accent mx-auto" />
                <div className="absolute inset-0 bg-accent/20 rounded-full blur-xl" />
              </div>
              <h3 className="text-xl font-bold mb-2">{category.title}</h3>
              <p className="text-muted-foreground">{category.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
