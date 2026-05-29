import type { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { FloatingWhatsApp } from "@/components/landing/FloatingWhatsApp";
import { TermsContent } from "@/components/landing/TermsContent";
import { brandName } from "@/lib/design-tokens";

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description: `Términos y condiciones de uso del sitio web de ${brandName}. Información legal sobre servicios, vehículos y contacto.`,
  alternates: {
    canonical: "/terminos",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const TerminosPage = () => {
  return (
    <>
      <Navbar />
      <main id="contenido-principal" className="flex-1" tabIndex={-1}>
        <section className="lcdv-section lcdv-section-textured scroll-mt-28 border-b border-lcdv-gold-2/12 pb-16 pt-28 sm:pb-20 sm:pt-32">
          <div className="lcdv-container">
            <TermsContent />
          </div>
        </section>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
};

export default TerminosPage;
