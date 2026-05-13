import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { TrustStatsSection } from "@/components/landing/TrustStatsSection";
import { ServicesSection } from "@/components/landing/ServicesSection";
import { GallerySection } from "@/components/landing/GallerySection";
import { WhyUsSection } from "@/components/landing/WhyUsSection";
import { FeaturedVehiclesSection } from "@/components/landing/FeaturedVehiclesSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { WhatsAppCtaSection } from "@/components/landing/WhatsAppCtaSection";
import { Footer } from "@/components/landing/Footer";
import { FloatingWhatsApp } from "@/components/landing/FloatingWhatsApp";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main id="contenido-principal" className="flex-1">
        <HeroSection />
        <TrustStatsSection />
        <ServicesSection />
        <GallerySection />
        <WhyUsSection />
        <FeaturedVehiclesSection />
        <TestimonialsSection />
        <WhatsAppCtaSection />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
