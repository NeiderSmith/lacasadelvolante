"use client";

import { motion } from "framer-motion";
import { whatsappHref } from "@/lib/site-config";

export const WhatsAppCtaSection = () => {
  return (
    <section
      id="contacto"
      className="scroll-mt-24 px-4 pb-24 pt-8 sm:px-6 lg:px-8"
      aria-labelledby="cta-whatsapp-heading"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.55 }}
        className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-lcdv-highlight/35 bg-lcdv-bronze/30 px-6 py-14 text-center shadow-lcdv-glow sm:px-12 sm:py-16"
      >
        <div
          className="pointer-events-none absolute -right-20 top-0 h-72 w-72 rounded-full bg-lcdv-highlight/15 blur-[100px]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-lcdv-gold/20 blur-[90px]"
          aria-hidden
        />
        <p className="relative text-xs font-semibold uppercase tracking-[0.35em] text-lcdv-muted">
          Cupos limitados por mes
        </p>
        <h2
          id="cta-whatsapp-heading"
          className="relative mt-4 font-display text-3xl font-semibold text-lcdv-text sm:text-4xl"
        >
          ¿Listo para transformar tu vehículo?
        </h2>
        <p className="relative mx-auto mt-4 max-w-xl text-sm text-lcdv-text-2 sm:text-base">
          Cotiza tapicería automotriz premium o consulta compra venta de vehículos
          en Bucaramanga. Respuesta prioritaria por WhatsApp.
        </p>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="relative mt-10 inline-flex min-h-[56px] min-w-[240px] items-center justify-center rounded-full bg-lcdv-gold px-10 py-4 text-base font-bold text-lcdv-text-dark shadow-lcdv-glow transition-transform hover:scale-[1.03] hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lcdv-light"
          aria-label="Abrir WhatsApp para cotización o inventario"
        >
          Escribir por WhatsApp
        </a>
      </motion.div>
    </section>
  );
};
