"use client";

import { motion } from "framer-motion";

const stats = [
  {
    value: "15+",
    label: "Años de experiencia",
    sub: "Tapicería y restauración en Bucaramanga",
  },
  {
    value: "500+",
    label: "Interiores restaurados",
    sub: "Volantes, tableros, asientos y cielos rasos",
  },
  {
    value: "98%",
    label: "Clientes satisfechos",
    sub: "Recomendaciones en Floridablanca y Girón",
  },
  {
    value: "Área metro",
    label: "Cobertura regional",
    sub: "Piedecuesta y Santander",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export const TrustStatsSection = () => {
  return (
    <section
      className="border-y border-lcdv-gold-2/15 bg-lcdv-bg py-16 sm:py-20"
      aria-labelledby="confianza-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2
          id="confianza-heading"
          className="font-display text-center text-2xl font-semibold text-lcdv-text sm:text-3xl"
        >
          Confianza que se siente al volante
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-lcdv-text-2 sm:text-base">
          Referente en tapicería automotriz premium y compra venta de vehículos
          en Bucaramanga. Atendemos con estándar de concesionario de lujo.
        </p>
        <motion.ul
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map((s) => (
            <motion.li
              key={s.label}
              variants={item}
              className="rounded-2xl border border-lcdv-gold-2/20 bg-lcdv-bronze/25 p-6 shadow-lcdv-card"
            >
              <p className="font-display text-3xl font-semibold text-lcdv-light sm:text-4xl">
                {s.value}
              </p>
              <p className="mt-2 text-sm font-semibold text-lcdv-text">{s.label}</p>
              <p className="mt-1 text-xs text-lcdv-muted sm:text-sm">{s.sub}</p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
};
