"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { PLACEHOLDER_IMAGE_SRC } from "@/lib/placeholder-image";
import { whatsappHref } from "@/lib/site-config";

const heroStats = [
  { title: "Respuesta prioritaria", sub: "WhatsApp Bucaramanga" },
  { title: "15+ años", sub: "Tapicería premium" },
  { title: "Área metro", sub: "Girón · Floridablanca" },
];

export const HeroSection = () => {
  return (
    <section
      id="inicio"
      className="relative scroll-mt-28 overflow-hidden"
      aria-labelledby="hero-heading"
    >
      <div className="absolute inset-0">
        <Image
          src={PLACEHOLDER_IMAGE_SRC}
          alt="Ambiente visual La Casa del Volante — tapicería automotriz Bucaramanga"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-lcdv-bg/88" aria-hidden />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,color-mix(in_srgb,var(--lcdv-primary-gold)_12%,transparent),transparent_55%)]"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-lcdv-bg/30 to-lcdv-bg"
          aria-hidden
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 sm:pb-24 sm:pt-32 lg:px-8 lg:pb-28 lg:pt-36">
        <div className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="text-[11px] font-semibold uppercase tracking-[0.32em] text-lcdv-muted sm:text-xs"
          >
            Bucaramanga · Santander
          </motion.p>

          <motion.h1
            id="hero-heading"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06, duration: 0.5 }}
            className="mt-4 font-display text-[2rem] font-semibold leading-[1.08] tracking-tight text-lcdv-text sm:text-5xl lg:text-[3.15rem] lg:leading-[1.05]"
          >
            <span className="text-lcdv-text">Tapicería </span>
            <span className="lcdv-text-gradient">premium</span>
            <span className="text-lcdv-text"> e interiores que </span>
            <span className="lcdv-text-gradient">elevan</span>
            <span className="text-lcdv-text"> tu vehículo en </span>
            <span className="lcdv-text-gradient">Bucaramanga</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14, duration: 0.5 }}
            className="mt-6 text-sm leading-relaxed text-lcdv-text-2 sm:text-base lg:text-lg"
          >
            Restauración de interiores, tapizado de volantes y asientos, y compra
            venta de vehículos curados. Misma exigencia de concesionario de lujo en
            Floridablanca, Girón y Piedecuesta.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.45 }}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
          >
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[48px] min-w-[200px] items-center justify-center rounded-full bg-lcdv-gold px-8 py-3 text-sm font-semibold text-lcdv-text-dark shadow-lcdv-glow transition-transform hover:scale-[1.02] hover:brightness-110"
              aria-label="Solicitar cotización por WhatsApp"
            >
              Solicitar cotización
            </a>
            <a
              href="#vehiculos"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-lcdv-gold-2/45 px-8 py-3 text-sm font-semibold text-lcdv-text transition-colors hover:border-lcdv-highlight hover:text-lcdv-light"
              aria-label="Ver vehículos en venta"
            >
              Ver vehículos
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
