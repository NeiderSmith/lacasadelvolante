import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { GallerySection } from "@/components/landing/GallerySection";
import { FeaturedVehiclesSection } from "@/components/landing/FeaturedVehiclesSection";
import { PreFooterCtaSection } from "@/components/landing/PreFooterCtaSection";
import { Footer } from "@/components/landing/Footer";
import { FloatingWhatsApp } from "@/components/landing/FloatingWhatsApp";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main id="contenido-principal" className="flex-1">
        <HeroSection />
        <GallerySection />
        <FeaturedVehiclesSection />
        <PreFooterCtaSection />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
