"use client"

import React from "react"
import { motion } from "framer-motion"
import { Lightbulb, Target, Award } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function AboutStory() {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Story */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="glass-morphism rounded-3xl p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
              <span className="gradient-text">Our Story</span>
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="text-lg leading-relaxed mb-6">
                Established in <span className="text-accent font-semibold">2012</span>, we pride ourselves on being a premier Telecom & IT company committed to delivering top-notch Engineering Infrastructure Solutions and Services. Over the past <span className="text-accent font-semibold">twelve years</span>, we've experienced rapid growth and are currently serving clients across the <span className="text-accent font-semibold">United States and Canada</span>.
              </p>
              <p className="text-lg leading-relaxed mb-6">
                With offices in <span className="text-accent font-semibold">Maryland, United States</span>, and <span className="text-accent font-semibold">Ontario, Canada</span>, we've also embraced the flexibility of remote work, leveraging teams located in <span className="text-accent font-semibold">California, the Greater Toronto Area, Montreal, and Calgary</span>.
              </p>
              <p className="text-lg leading-relaxed">
                Our team comprises highly skilled and dedicated professionals with extensive experience in the Telecom & IT industry. We are passionate about providing <span className="text-accent font-semibold">innovative, powerful, and strategic methodologies</span> to deliver cost-effective Telecom and Infrastructure solutions.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Values Grid */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-12">
            <span className="gradient-text">Our Core Values</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Lightbulb,
                title: "Innovation",
                description: "We leverage cutting-edge technology and innovative methodologies to deliver solutions that exceed expectations and drive business growth."
              },
              {
                icon: Target,
                title: "Excellence",
                description: "Our commitment to excellence fuels everything we do, ensuring that our clients receive the highest quality service and solutions tailored to their unique needs."
              },
              {
                icon: Award,
                title: "Reliability",
                description: "With over a decade of experience, we've built a reputation for delivering reliable, cost-effective solutions that our clients can depend on."
              }
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card variant="glass" className="h-full text-center hover:scale-105 transition-all duration-300">
                  <CardHeader>
                    <div className="relative mb-4">
                      <value.icon className="h-16 w-16 text-accent mx-auto" />
                      <div className="absolute inset-0 bg-accent/20 rounded-full blur-xl" />
                    </div>
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground">
                      {value.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Expertise Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="glass-morphism rounded-3xl p-8 md:p-12 text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-6">
              <span className="gradient-text">Our Expertise</span>
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-4xl mx-auto">
              Within our Telecom group, we specialize in <span className="text-accent font-semibold">Wireless and Wireline Network Design, Optimization, Switching, and Troubleshooting</span>. Whether you're seeking to enhance an existing network or address complex challenges, our expertise ensures tailored solutions that meet your specific needs and exceed expectations.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
