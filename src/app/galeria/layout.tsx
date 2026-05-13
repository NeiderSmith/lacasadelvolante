import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { FloatingWhatsApp } from "@/components/landing/FloatingWhatsApp";

export default function GaleriaLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Navbar />
      <main id="contenido-principal" className="flex-1">
        {children}
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
