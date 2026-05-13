"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { whatsappHref } from "@/lib/site-config";

const upholstery = [
  {
    title: "Tapizado de volantes",
    desc: "Volantes deportivos, madera noble y costuras a mano. Tapizado de volantes Bucaramanga.",
    img: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=900&q=80",
    alt: "Volante automotriz deportivo con acabados premium para tapicería en Bucaramanga",
  },
  {
    title: "Restauración de tableros",
    desc: "Tableros con cuero, alcántara y detalles metálicos. Restauración de tableros Santander.",
    img: "https://images.unsplash.com/photo-1503376780353-7e669276fc42?auto=format&fit=crop&w=900&q=80",
    alt: "Tablero de vehículo de lujo para restauración de interiores en Bucaramanga",
  },
  {
    title: "Asientos y cielo raso",
    desc: "Tapizado de asientos, costuras diamante y cielos personalizados.",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80",
    alt: "Asientos de cuero en tapicería automotriz premium Bucaramanga",
  },
  {
    title: "Interiores a medida",
    desc: "Palancas, consolas e interiores completos con identidad exclusiva.",
    img: "https://images.unsplash.com/photo-1619405399517-d7fce0f13302?auto=format&fit=crop&w=900&q=80",
    alt: "Interior automotriz personalizado tapicería premium Girón y Piedecuesta",
  },
];

const vehicles = [
  {
    title: "Compra y venta de vehículos",
    desc: "Venta de carros usados premium con peritaje y historial transparente.",
    img: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&w=900&q=80",
    alt: "Vehículo premium para compra venta de vehículos Bucaramanga",
  },
  {
    title: "Compra de tu vehículo",
    desc: "Valoración justa y cierre ágil. Compra venta de vehículos en Floridablanca.",
    img: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=900&q=80",
    alt: "Evaluación de vehículo usado premium en Santander",
  },
];

export const ServicesSection = () => {
  return (
    <section
      id="servicios"
      className="scroll-mt-24 py-20 sm:py-28"
      aria-labelledby="servicios-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-lcdv-muted">
            Servicios
          </p>
          <h2
            id="servicios-heading"
            className="mt-2 font-display text-3xl font-semibold text-lcdv-text sm:text-4xl"
          >
            Tapicería automotriz y compra venta de vehículos en Bucaramanga
          </h2>
          <p className="mt-4 text-base text-lcdv-text-2 sm:text-lg">
            Tapicería de carros, restauración de interiores de vehículos, tapizado
            de asientos y volantes, y asesoría en venta de carros usados premium en
            Santander. Cobertura en Girón, Piedecuesta y Floridablanca.
          </p>
        </div>

        <div className="mt-14 space-y-20">
          <div>
            <h3 className="font-display text-xl font-semibold text-lcdv-light sm:text-2xl">
              Tapicería automotriz premium
            </h3>
            <p className="mt-2 max-w-3xl text-sm text-lcdv-text-2 sm:text-base">
              Especialistas en tapicería automotriz en Bucaramanga con materiales de
              lujo y acabados tipo concesionario premium.
            </p>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2">
              {upholstery.map((card, i) => (
                <motion.li
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.05, duration: 0.45 }}
                  className="group overflow-hidden rounded-2xl border border-lcdv-gold-2/20 bg-lcdv-bronze/15 shadow-lcdv-card transition-transform hover:-translate-y-1"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={card.img}
                      alt={card.alt}
                      fill
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-lcdv-bg via-transparent to-transparent opacity-80" />
                  </div>
                  <div className="p-6">
                    <h4 className="font-display text-lg font-semibold text-lcdv-text">
                      {card.title}
                    </h4>
                    <p className="mt-2 text-sm text-lcdv-text-2">{card.desc}</p>
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex text-sm font-semibold text-lcdv-highlight transition-colors hover:text-lcdv-light"
                      aria-label={`Cotizar ${card.title} por WhatsApp`}
                    >
                      Cotizar este servicio →
                    </a>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-xl font-semibold text-lcdv-light sm:text-2xl">
              Compra y venta de vehículos
            </h3>
            <p className="mt-2 max-w-3xl text-sm text-lcdv-text-2 sm:text-base">
              Venta de carros usados premium y compra con evaluación profesional en
              Bucaramanga y área metropolitana.
            </p>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2">
              {vehicles.map((card, i) => (
                <motion.li
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.06, duration: 0.45 }}
                  className="group overflow-hidden rounded-2xl border border-lcdv-gold-2/20 bg-lcdv-bronze/15 shadow-lcdv-card transition-transform hover:-translate-y-1"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={card.img}
                      alt={card.alt}
                      fill
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-lcdv-bg via-transparent to-transparent opacity-80" />
                  </div>
                  <div className="p-6">
                    <h4 className="font-display text-lg font-semibold text-lcdv-text">
                      {card.title}
                    </h4>
                    <p className="mt-2 text-sm text-lcdv-text-2">{card.desc}</p>
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex text-sm font-semibold text-lcdv-highlight transition-colors hover:text-lcdv-light"
                      aria-label={`Consultar ${card.title} por WhatsApp`}
                    >
                      Hablar con un asesor →
                    </a>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
