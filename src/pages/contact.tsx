import { Geist, Geist_Mono } from "next/font/google";
import { Layout } from "@/components/layout/layout";
import { ContactHero } from "@/components/sections/contact-hero";
import { ContactForm } from "@/components/sections/contact-form";
import { ContactInfo } from "@/components/sections/contact-info";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Contact() {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable}`}>
      <Layout>
        <ContactHero />
        <ContactForm />
        <ContactInfo />
      </Layout>
    </div>
  );
}
