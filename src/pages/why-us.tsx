import { Geist, Geist_Mono } from "next/font/google";
import { Layout } from "@/components/layout/layout";
import { WhyUsHero } from "@/components/sections/why-us-hero";
import { WhyUsFeatures } from "@/components/sections/why-us-features";
import { WhyUsCTA } from "@/components/sections/why-us-cta";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function WhyUs() {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable}`}>
      <Layout>
        <WhyUsHero />
        <WhyUsFeatures />
        <WhyUsCTA />
      </Layout>
    </div>
  );
}
