import type { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { FloatingWhatsApp } from "@/components/landing/FloatingWhatsApp";
import { VehiclesMarketplace } from "@/components/vehicle-listing/VehiclesMarketplace";
import { brandName } from "@/lib/design-tokens";

export const metadata: Metadata = {
  title: "Vehículos en venta",
  description: `Mercado de vehículos de ${brandName} en Bucaramanga. Filtra por precio y tipo y consulta por WhatsApp.`,
  alternates: {
    canonical: "/vehiculos",
  },
};

const VehiculosPage = () => {
  return (
    <>
      <Navbar />
      <main id="contenido-principal" className="flex-1" tabIndex={-1}>
        <section className="lcdv-section-textured scroll-mt-28 border-b border-lcdv-gold-2/12 pb-12 pt-28 sm:pb-16 sm:pt-32 lg:pb-20">
          <h1 className="sr-only">Vehículos en venta</h1>
          <VehiclesMarketplace />
        </section>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
};

export default VehiculosPage;
