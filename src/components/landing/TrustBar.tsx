"use client";

import { motion, useReducedMotion } from "framer-motion";

const TRUST_ITEMS = [
  {
    id: "experience",
    value: "15+",
    label: "Años de experiencia",
    detail: "Tapicería y restauración automotriz",
  },
  {
    id: "materials",
    value: "Premium",
    label: "Materiales de calidad",
    detail: "Cuero, alcántara y costuras de precisión",
  },
  {
    id: "response",
    value: "24h",
    label: "Respuesta por WhatsApp",
    detail: "Cotización sin compromiso",
  },
  {
    id: "coverage",
    value: "4",
    label: "Ciudades atendidas",
    detail: "Bucaramanga y área metropolitana",
  },
] as const;

export const TrustBar = () => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      className="lcdv-section-textured border-y border-lcdv-gold-2/15"
      aria-label="Indicadores de confianza"
    >
      <div className="lcdv-container py-8 sm:py-10">
        <ul className="grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8">
          {TRUST_ITEMS.map((item, index) => (
            <motion.li
              key={item.id}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-24px" }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              className="flex flex-col items-center text-center sm:items-start sm:text-left"
            >
              <span className="font-display text-2xl font-semibold text-lcdv-highlight sm:text-3xl">
                {item.value}
              </span>
              <span className="mt-1 font-sans text-sm font-semibold text-lcdv-text">
                {item.label}
              </span>
              <span className="mt-0.5 text-xs leading-relaxed text-lcdv-text-2">
                {item.detail}
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
};
