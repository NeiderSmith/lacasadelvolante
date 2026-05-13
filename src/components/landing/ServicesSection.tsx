"use client";

import { motion } from "framer-motion";

const services = [
  {
    title: "Tapizado de volantes",
    desc: "Deportivo, madera noble y costuras manuales. Tapizado de volantes Bucaramanga.",
  },
  {
    title: "Restauración de tableros",
    desc: "Cuero, alcántara y detalles metálicos. Restauración de tableros Santander.",
  },
  {
    title: "Asientos y cielo raso",
    desc: "Costuras diamante, tapizado de asientos y cielos personalizados.",
  },
  {
    title: "Interiores a medida",
    desc: "Consolas, palancas e identidad exclusiva para tu vehículo.",
  },
  {
    title: "Compra y venta de vehículos",
    desc: "Inventario curado y asesoría en venta de carros usados premium.",
  },
  {
    title: "Peritaje y tasación",
    desc: "Evaluación transparente para compra o venta en el área metropolitana.",
  },
];

export const ServicesSection = () => {
  return (
    <section
      id="servicios"
      className="lcdv-services-strip scroll-mt-28 py-16 sm:py-20 lg:py-24"
      aria-label="Servicios"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          {services.map((item, i) => (
            <motion.li
              key={item.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.04, duration: 0.4 }}
              className="flex flex-col rounded-xl border border-lcdv-highlight/45 bg-lcdv-bg p-5 shadow-[0_24px_60px_rgba(1,7,14,0.42)] sm:p-6"
            >
              <p className="font-display text-base font-semibold text-lcdv-text">
                {item.title}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-lcdv-text-2">
                {item.desc}
              </p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
};
