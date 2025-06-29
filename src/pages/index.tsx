import { Geist, Geist_Mono } from "next/font/google";
import { Layout } from "@/components/layout/layout";
import { Hero } from "@/components/sections/hero";
import { Services } from "@/components/sections/services";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable}`}>
      <Layout>
        <Hero />
        <Services />
      </Layout>
    </div>
  );
}
