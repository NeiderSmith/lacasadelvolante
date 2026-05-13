"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useFeaturedVehicles } from "@/hooks/use-featured-vehicles";
import { hasAmplifyOutputsEnv } from "@/lib/amplify/configure";
import { PLACEHOLDER_IMAGE_SRC } from "@/lib/placeholder-image";
import { whatsappHref } from "@/lib/site-config";

export const FeaturedVehiclesSection = () => {
  const { vehicles, loading } = useFeaturedVehicles();
  const useRemote = hasAmplifyOutputsEnv();

  return (
    <section
      id="vehiculos"
      className="lcdv-vehicles-strip scroll-mt-28 py-20 sm:py-28"
      aria-labelledby="vehiculos-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-lcdv-gold">
              En venta
            </p>
            <h2
              id="vehiculos-heading"
              className="mt-3 font-display text-3xl font-semibold leading-tight text-lcdv-text-dark sm:text-4xl"
            >
              Vehículos disponibles
            </h2>
            <p className="mt-3 text-sm text-lcdv-text-dark/80 sm:text-base">
              Selección en Bucaramanga. Precios y disponibilidad confirmados por
              WhatsApp.
            </p>
          </div>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center rounded-full border-2 border-[var(--lcdv-primary-background)] px-5 py-2.5 text-sm font-semibold text-[var(--lcdv-text-on-gold)] transition-colors hover:bg-[var(--lcdv-primary-background)] hover:text-[var(--lcdv-text-primary)]"
            aria-label="Ver todo el inventario por WhatsApp"
          >
            Ver todo
          </a>
        </div>

        {loading ? (
          <ul
            className="mt-12 grid gap-8 md:grid-cols-3"
            aria-busy="true"
            aria-label="Cargando vehículos"
          >
            {[0, 1, 2].map((i) => (
              <li
                key={i}
                className="overflow-hidden rounded-2xl border border-lcdv-highlight/30 bg-lcdv-bg/60"
              >
                <div className="aspect-[5/3] animate-pulse bg-lcdv-text-dark/10" />
                <div className="space-y-3 p-5">
                  <div className="h-5 w-3/4 animate-pulse rounded bg-lcdv-text-dark/10" />
                  <div className="h-3 w-full animate-pulse rounded bg-lcdv-text-dark/10" />
                  <div className="h-10 w-1/2 animate-pulse rounded bg-lcdv-text-dark/10" />
                </div>
              </li>
            ))}
          </ul>
        ) : vehicles.length === 0 && useRemote ? (
          <div className="mt-12 rounded-2xl border border-lcdv-highlight/35 bg-lcdv-bg/80 px-6 py-12 text-center">
            <p className="text-sm text-lcdv-text-dark/85 sm:text-base">
              En este momento no hay vehículos publicados en la web. Escribe por
              WhatsApp y te contamos el inventario disponible.
            </p>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center justify-center rounded-full border-2 border-[var(--lcdv-primary-background)] px-6 py-2.5 text-sm font-semibold text-[var(--lcdv-text-on-gold)] transition-colors hover:bg-[var(--lcdv-primary-background)] hover:text-[var(--lcdv-text-primary)]"
            >
              Consultar por WhatsApp
            </a>
          </div>
        ) : (
          <ul className="mt-12 grid gap-8 md:grid-cols-3">
            {vehicles.map((v, i) => {
              const src = v.imageUrl ?? PLACEHOLDER_IMAGE_SRC;
              const remote = Boolean(v.imageUrl);
              return (
                <motion.li
                  key={v.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-lcdv-highlight/45 bg-lcdv-bg shadow-[0_28px_70px_rgba(1,7,14,0.45)]"
                >
                  <div className="relative aspect-[5/3] overflow-hidden">
                    <Image
                      src={src}
                      alt={v.alt}
                      fill
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      unoptimized={remote}
                      className="object-cover opacity-95 transition duration-500 group-hover:scale-[1.04]"
                    />
                    {/* Degradado suave para leer chips sobre fotos claras u oscuras */}
                    <div
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/35"
                      aria-hidden
                    />
                    <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-2 p-3 sm:p-3.5">
                      <span className="shrink-0 rounded-full bg-black/55 px-3 py-1.5 text-xs font-bold tabular-nums text-white ring-1 ring-white/20 backdrop-blur-sm">
                        {v.year ?? "—"}
                      </span>
                      <div className="flex min-w-0 max-w-[min(100%,14rem)] shrink justify-end sm:max-w-[min(100%,16rem)]">
                        {v.badge ? (
                          <span
                            className="block w-full rounded-lg border border-lcdv-highlight/80 bg-black/60 px-3 py-1.5 text-right text-xs font-semibold leading-snug tracking-normal text-lcdv-light shadow-md backdrop-blur-md text-balance"
                            title={v.badge}
                          >
                            {v.badge}
                          </span>
                        ) : (
                          <span className="rounded-full bg-black/50 px-3 py-1.5 text-xs font-medium text-white/95 ring-1 ring-white/15 backdrop-blur-sm">
                            Consultar
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-display text-lg font-semibold text-lcdv-text">
                      {v.name}
                    </h3>
                    <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-lcdv-text-2 sm:text-xs">
                      <li className="flex items-center gap-1">
                        <span className="text-lcdv-highlight" aria-hidden>
                          ●
                        </span>
                        {v.engine}
                      </li>
                      <li className="flex items-center gap-1">
                        <span className="text-lcdv-highlight" aria-hidden>
                          ●
                        </span>
                        {v.power}
                      </li>
                      <li className="flex items-center gap-1">
                        <span className="text-lcdv-highlight" aria-hidden>
                          ●
                        </span>
                        {v.trans}
                      </li>
                      <li className="flex items-center gap-1">
                        <span className="text-lcdv-highlight" aria-hidden>
                          ●
                        </span>
                        {v.km}
                      </li>
                    </ul>

                    <div className="mt-5 flex items-end justify-between gap-3 border-t border-lcdv-gold-2/25 pt-4">
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-wider text-lcdv-muted">
                          Desde
                        </p>
                        <p className="font-display text-xl font-semibold text-lcdv-light sm:text-2xl">
                          {v.price}{" "}
                          <span className="text-sm font-medium text-lcdv-muted">
                            COP
                          </span>
                        </p>
                      </div>
                      <a
                        href={whatsappHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-lcdv-highlight/50 bg-lcdv-gold/20 text-lcdv-highlight transition-colors hover:border-lcdv-light hover:bg-lcdv-gold hover:text-lcdv-text-dark"
                        aria-label={`Ver ficha de ${v.name} por WhatsApp`}
                      >
                        <span className="text-lg" aria-hidden>
                          →
                        </span>
                      </a>
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
};
