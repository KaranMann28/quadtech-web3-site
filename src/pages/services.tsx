import { Geist, Geist_Mono } from "next/font/google";
import { Layout } from "@/components/layout/layout";
import { ServicesHero } from "@/components/sections/services-hero";
import { ServicesGrid } from "@/components/sections/services-grid";
import { ServicesCTA } from "@/components/sections/services-cta";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Services() {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable}`}>
      <Layout>
        <ServicesHero />
        <ServicesGrid />
        <ServicesCTA />
      </Layout>
    </div>
  );
}
