"use client"

import React from "react"
import { motion } from "framer-motion"
import { Building2, Users, Globe } from "lucide-react"
import { Breadcrumb } from "@/components/ui/breadcrumb"

export function AboutHero() {
  return (
    <section className="relative py-24 bg-gradient-to-br from-background via-background to-primary/10 overflow-hidden">
      {/* Geometric Pattern Overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.4'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Breadcrumb items={[{ label: "About us" }]} />
        </motion.div>

        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">About QuadTech</span>
            <br />
            <span className="text-foreground">Solutions</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Premier Telecom & IT company delivering top-notch Engineering Infrastructure 
            Solutions and Services since <span className="text-accent font-semibold">2012</span>
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          {[
            { 
              icon: Building2, 
              number: "12+", 
              label: "Years of Excellence",
              description: "Established in 2012"
            },
            { 
              icon: Globe, 
              number: "2", 
              label: "Countries Served",
              description: "United States & Canada"
            },
            { 
              icon: Users, 
              number: "5+", 
              label: "Office Locations",
              description: "Maryland, Ontario, California, GTA, Montreal, Calgary"
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center glass-morphism rounded-2xl p-8 hover:scale-105 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
            >
              <div className="relative mb-6">
                <stat.icon className="h-16 w-16 text-accent mx-auto" />
                <div className="absolute inset-0 bg-accent/20 rounded-full blur-xl" />
              </div>
              <div className="text-4xl font-bold gradient-text mb-2">
                {stat.number}
              </div>
              <div className="text-lg font-semibold text-foreground mb-2">
                {stat.label}
              </div>
              <div className="text-sm text-muted-foreground">
                {stat.description}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
