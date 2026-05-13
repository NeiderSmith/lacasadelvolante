"use client";

import { motion } from "framer-motion";
import { whatsappHref } from "@/lib/site-config";

const reasons = [
  {
    title: "Materiales premium",
    body: "Cueros, alcántara y fibras seleccionadas para tapicería de carros con durabilidad de fábrica.",
  },
  {
    title: "Trabajo artesanal",
    body: "Costuras, bieses y volantes con precisión manual. Tapizado de volantes Bucaramanga con acabado exclusivo.",
  },
  {
    title: "Atención personalizada",
    body: "Asesoría en Floridablanca, Girón y Piedecuesta. Cada vehículo recibe un plan de restauración claro.",
  },
  {
    title: "Acabados de lujo",
    body: "Estética inspirada en marcas premium: detalles metálicos dorados y superficies cinematográficas.",
  },
];

export const WhyUsSection = () => {
  return (
    <section
      className="py-20 sm:py-28"
      aria-labelledby="por-que-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-lcdv-muted">
              Por qué elegirnos
            </p>
            <h2
              id="por-que-heading"
              className="mt-2 font-display text-3xl font-semibold text-lcdv-text sm:text-4xl"
            >
              Especialistas en tapicería automotriz premium en Bucaramanga
            </h2>
            <p className="mt-4 text-base text-lcdv-text-2 sm:text-lg">
              No somos un taller genérico: somos un estudio de interiores automotrices
              con mentalidad de concesionario de lujo. Confianza, exclusividad y
              resultados que elevan el valor de tu vehículo en Santander.
            </p>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex min-h-[48px] items-center rounded-full bg-lcdv-gold px-7 py-3 text-sm font-semibold text-lcdv-text-dark shadow-lcdv-soft transition-transform hover:scale-[1.02]"
              aria-label="Agendar valoración por WhatsApp"
            >
              Agendar valoración
            </a>
          </div>
          <ul className="space-y-5">
            {reasons.map((r, i) => (
              <motion.li
                key={r.title}
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.06, duration: 0.45 }}
                className="rounded-2xl border border-lcdv-gold-2/20 bg-lcdv-bronze/20 p-6 shadow-lcdv-inner"
              >
                <h3 className="font-display text-lg font-semibold text-lcdv-light">
                  {r.title}
                </h3>
                <p className="mt-2 text-sm text-lcdv-text-2 sm:text-base">{r.body}</p>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
