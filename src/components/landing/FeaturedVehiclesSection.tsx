"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { whatsappHref } from "@/lib/site-config";

const featuredVehicles = [
  {
    name: "SUV ejecutiva AWD",
    year: 2022,
    km: "38.000 km",
    price: "$189.000.000 COP",
    img: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=900&q=80",
    alt: "SUV premium disponible en venta de carros usados Bucaramanga",
  },
  {
    name: "Berlina deportiva V6",
    year: 2021,
    km: "52.000 km",
    price: "$165.000.000 COP",
    img: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&w=900&q=80",
    alt: "Berlina de lujo en compra venta de vehículos Santander",
  },
  {
    name: "Coupé gran turismo",
    year: 2020,
    km: "44.500 km",
    price: "$142.000.000 COP",
    img: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=900&q=80",
    alt: "Coupé premium venta vehículos usados Floridablanca Girón",
  },
];

export const FeaturedVehiclesSection = () => {
  return (
    <section
      id="vehiculos"
      className="scroll-mt-24 border-t border-lcdv-gold-2/15 bg-lcdv-bg py-20 sm:py-28"
      aria-labelledby="vehiculos-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-lcdv-muted">
              Inventario destacado
            </p>
            <h2
              id="vehiculos-heading"
              className="mt-2 font-display text-3xl font-semibold text-lcdv-text sm:text-4xl"
            >
              Vehículos destacados — compra venta en Bucaramanga
            </h2>
            <p className="mt-3 text-base text-lcdv-text-2 sm:text-lg">
              Ejemplos de unidades curadas con peritaje. Inventario rotativo;
              disponibilidad sujeta a confirmación por WhatsApp.
            </p>
          </div>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-full border border-lcdv-highlight/50 px-5 py-2 text-sm font-semibold text-lcdv-light transition-colors hover:bg-lcdv-highlight/10"
            aria-label="Consultar inventario actual por WhatsApp"
          >
            Ver inventario actual
          </a>
        </div>

        <ul className="mt-12 grid gap-8 md:grid-cols-3">
          {featuredVehicles.map((v, i) => (
            <motion.li
              key={v.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.07, duration: 0.45 }}
              className="group flex flex-col overflow-hidden rounded-2xl border border-lcdv-gold-2/20 bg-lcdv-bronze/15 shadow-lcdv-card"
            >
              <div className="relative aspect-[5/3] overflow-hidden">
                <Image
                  src={v.img}
                  alt={v.alt}
                  fill
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute left-3 top-3 rounded-full bg-lcdv-bg/80 px-3 py-1 text-xs font-semibold text-lcdv-text backdrop-blur">
                  Disponible bajo consulta
                </div>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-lg font-semibold text-lcdv-text">
                  {v.name}
                </h3>
                <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-lcdv-muted sm:text-sm">
                  <div>
                    <dt className="font-medium text-lcdv-text-2">Año</dt>
                    <dd>{v.year}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-lcdv-text-2">Kilometraje</dt>
                    <dd>{v.km}</dd>
                  </div>
                </dl>
                <p className="mt-4 font-display text-xl font-semibold text-lcdv-light">
                  {v.price}
                </p>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-full bg-lcdv-gold/90 px-4 py-2 text-center text-sm font-semibold text-lcdv-text-dark transition hover:brightness-110"
                  aria-label={`Ver más detalles de ${v.name} por WhatsApp`}
                >
                  Ver más
                </a>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
};
