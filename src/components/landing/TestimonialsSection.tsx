"use client";

import { motion } from "framer-motion";

const items = [
  {
    quote:
      "Restauraron el interior de mi berlina con un nivel de detalle que no había visto en Bucaramanga. El volante y los asientos quedaron espectaculares.",
    name: "Carlos M.",
    place: "Floridablanca",
  },
  {
    quote:
      "Compré un SUV con ellos: transparencia total en el peritaje y entrega impecable. Se nota el trato premium.",
    name: "Laura R.",
    place: "Girón",
  },
  {
    quote:
      "Tapizado de asientos y tablero con acabado tipo fábrica alemana. Recomendados para quien busca exclusividad.",
    name: "Andrés V.",
    place: "Piedecuesta",
  },
];

export const TestimonialsSection = () => {
  return (
    <section
      id="testimonios"
      className="scroll-mt-24 py-20 sm:py-28"
      aria-labelledby="testimonios-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2
          id="testimonios-heading"
          className="text-center font-display text-3xl font-semibold text-lcdv-text sm:text-4xl"
        >
          Testimonios de clientes en Santander
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-lcdv-text-2 sm:text-base">
          Confianza real de quienes vivieron la experiencia La Casa del Volante en
          la ciudad y el área metropolitana.
        </p>
        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {items.map((t, i) => (
            <motion.li
              key={t.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.08, duration: 0.45 }}
              className="flex flex-col rounded-2xl border border-lcdv-gold-2/20 bg-lcdv-bronze/15 p-6 shadow-lcdv-card"
            >
              <p className="flex-1 text-sm leading-relaxed text-lcdv-text-2 sm:text-base">
                “{t.quote}”
              </p>
              <footer className="mt-6 border-t border-lcdv-gold-2/15 pt-4">
                <p className="text-sm font-semibold text-lcdv-text">{t.name}</p>
                <p className="text-xs text-lcdv-muted">{t.place}, Santander</p>
              </footer>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
};
