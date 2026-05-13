"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { whatsappHref } from "@/lib/site-config";

const pairs = [
  {
    before:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80",
    after:
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=900&q=80",
    title: "Restauración de interior deportivo",
    caption:
      "Tapicería premium: volante, asientos y detalles en cuero perforado.",
  },
  {
    before:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=80",
    after:
      "https://images.unsplash.com/photo-1619405399517-d7fce0f13302?auto=format&fit=crop&w=900&q=80",
    title: "Acabados tipo concesionario de lujo",
    caption:
      "Restauración de interiores de vehículos con control de color y textura.",
  },
];

export const GallerySection = () => {
  return (
    <section
      id="galeria"
      className="scroll-mt-24 border-t border-lcdv-gold-2/15 bg-lcdv-bg py-20 sm:py-28"
      aria-labelledby="galeria-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-lcdv-muted">
            Galería
          </p>
          <h2
            id="galeria-heading"
            className="mt-2 font-display text-3xl font-semibold text-lcdv-text sm:text-4xl"
          >
            Antes y después: tapicería automotriz en Bucaramanga
          </h2>
          <p className="mt-4 text-base text-lcdv-text-2 sm:text-lg">
            Resultados reales de tapizado de asientos, restauración de tableros y
            tapicería premium automotriz Santander. Cada proyecto con estándar de
            detailing de lujo.
          </p>
        </div>

        <div className="mt-14 space-y-16">
          {pairs.map((pair, index) => (
            <motion.article
              key={pair.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="grid gap-8 lg:grid-cols-2 lg:items-center"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <figure className="overflow-hidden rounded-2xl border border-lcdv-gold-2/25 shadow-lcdv-card">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={pair.before}
                      alt={`Antes: ${pair.title} — tapicería automotriz Bucaramanga`}
                      fill
                      loading="lazy"
                      sizes="(max-width: 1024px) 50vw, 25vw"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="bg-lcdv-bronze/40 px-3 py-2 text-center text-xs font-semibold uppercase tracking-wider text-lcdv-muted">
                    Antes
                  </figcaption>
                </figure>
                <figure className="overflow-hidden rounded-2xl border border-lcdv-highlight/35 shadow-lcdv-glow">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={pair.after}
                      alt={`Después: ${pair.title} — restauración de interiores Bucaramanga`}
                      fill
                      loading="lazy"
                      sizes="(max-width: 1024px) 50vw, 25vw"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="bg-lcdv-gold/30 px-3 py-2 text-center text-xs font-semibold uppercase tracking-wider text-lcdv-text">
                    Después
                  </figcaption>
                </figure>
              </div>
              <div>
                <h3 className="font-display text-2xl font-semibold text-lcdv-text">
                  {pair.title}
                </h3>
                <p className="mt-3 text-sm text-lcdv-text-2 sm:text-base">
                  {pair.caption}
                </p>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex min-h-[44px] items-center rounded-full border border-lcdv-gold-2/50 px-6 py-2 text-sm font-semibold text-lcdv-text transition-colors hover:border-lcdv-highlight hover:text-lcdv-light"
                  aria-label="Solicitar proyecto similar por WhatsApp"
                >
                  Quiero un resultado así
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};
