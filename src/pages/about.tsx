import { Geist, Geist_Mono } from "next/font/google";
import { Layout } from "@/components/layout/layout";
import { AboutHero } from "@/components/sections/about-hero";
import { AboutStory } from "@/components/sections/about-story";
import { AboutTeam } from "@/components/sections/about-team";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function About() {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable}`}>
      <Layout>
        <AboutHero />
        <AboutStory />
        <AboutTeam />
      </Layout>
    </div>
  );
}
