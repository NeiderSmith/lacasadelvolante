import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { TrustBar } from "@/components/landing/TrustBar";
import { ServicesSection } from "@/components/landing/ServicesSection";
import { GallerySection } from "@/components/landing/GallerySection";
import { VehicleBrandsMarquee } from "@/components/landing/VehicleBrandsMarquee";
import { FeaturedVehiclesSection } from "@/components/landing/FeaturedVehiclesSection";
import { LocationSection } from "@/components/landing/LocationSection";
import { Footer } from "@/components/landing/Footer";
import { FloatingWhatsApp } from "@/components/landing/FloatingWhatsApp";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main id="contenido-principal" className="flex-1" tabIndex={-1}>
        <HeroSection />
        <VehicleBrandsMarquee />
        <TrustBar />
        <ServicesSection />
        <GallerySection />
        <FeaturedVehiclesSection />
        <LocationSection />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
