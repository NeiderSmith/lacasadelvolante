"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { whatsappHref } from "@/lib/site-config";

export const HeroSection = () => {
  return (
    <section
      id="inicio"
      className="relative flex min-h-[100dvh] flex-col justify-end overflow-hidden pb-24 pt-28 sm:pb-32 sm:pt-32"
      aria-labelledby="hero-heading"
    >
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=2400&q=80"
          alt="Interior automotriz premium: tablero y volante de vehículo de lujo, tapicería automotriz Bucaramanga"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div
          className="absolute inset-0 lcdv-bg-dark-elegant opacity-95"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-lcdv-bg via-lcdv-bg/70 to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-24 top-1/3 h-96 w-96 rounded-full bg-lcdv-highlight/10 blur-[120px]"
          aria-hidden
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-lcdv-muted sm:text-sm"
        >
          Bucaramanga · Floridablanca · Girón · Piedecuesta · Santander
        </motion.p>
        <motion.h1
          id="hero-heading"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.65 }}
          className="max-w-4xl font-display text-3xl font-semibold leading-tight tracking-tight text-lcdv-text sm:text-4xl md:text-5xl lg:text-[3.25rem]"
        >
          Tapicería automotriz premium y compra venta de vehículos en Bucaramanga
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.65 }}
          className="mt-5 max-w-2xl text-base leading-relaxed text-lcdv-text-2 sm:text-lg"
        >
          Especialistas en tapicería de carros, restauración de interiores de
          vehículos, tapizado de volantes y asientos, y asesoría en venta de
          carros usados premium. Experiencia exclusiva para quienes exigen
          excelencia en Santander.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.6 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
        >
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-lcdv-gold px-8 py-3 text-center text-sm font-semibold text-lcdv-text-dark shadow-lcdv-glow transition-transform hover:scale-[1.02] hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lcdv-light"
            aria-label="Solicitar cotización por WhatsApp"
          >
            Solicitar cotización
          </a>
          <a
            href="#vehiculos"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-lcdv-gold-2/60 bg-lcdv-bg/40 px-8 py-3 text-sm font-semibold text-lcdv-text backdrop-blur-sm transition-colors hover:border-lcdv-highlight hover:text-lcdv-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lcdv-muted"
            aria-label="Ver vehículos disponibles"
          >
            Ver vehículos disponibles
          </a>
        </motion.div>
      </div>
    </section>
  );
};
