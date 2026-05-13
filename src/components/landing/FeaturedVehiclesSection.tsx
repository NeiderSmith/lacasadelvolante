"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useFeaturedVehicles } from "@/hooks/use-featured-vehicles";
import { hasAmplifyOutputsEnv } from "@/lib/amplify/configure";
import { PLACEHOLDER_IMAGE_SRC } from "@/lib/placeholder-image";
import {
  whatsappHref,
  whatsappVehicleBuyHref,
  whatsappVehicleSellHref,
} from "@/lib/site-config";

export const FeaturedVehiclesSection = () => {
  const { vehicles, loading } = useFeaturedVehicles();
  const useRemote = hasAmplifyOutputsEnv();

  return (
    <section id="vehiculos" className="scroll-mt-28" aria-labelledby="vehiculos-heading">
      <div className="lcdv-vehicles-strip py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-32px" }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-2xl border border-lcdv-highlight/40 shadow-[0_28px_80px_rgba(1,7,14,0.35)]"
          >
          <div className="absolute inset-0">
            <Image
              src="/placeholder-automotive.svg"
              alt=""
              fill
              className="object-cover object-center opacity-[0.18]"
              sizes="(max-width: 1280px) 100vw, 1200px"
              aria-hidden
            />
            <div
              className="absolute inset-0 bg-gradient-to-br from-black/88 via-zinc-950/92 to-black/90"
              aria-hidden
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/30"
              aria-hidden
            />
            <div
              className="absolute inset-0 bg-gradient-to-r from-lcdv-highlight/10 via-transparent to-transparent"
              aria-hidden
            />
          </div>

          <div className="relative z-10 grid gap-10 px-5 py-10 sm:gap-12 sm:px-8 sm:py-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-center lg:gap-14">
            <div>
              <p className="font-sans text-[11px] font-bold uppercase tracking-[0.28em] text-lcdv-highlight drop-shadow-[0_1px_6px_rgba(0,0,0,0.85)] sm:text-xs">
                Compra y venta
              </p>
              <h2
                id="vehiculos-heading"
                className="mt-3 font-sans text-3xl font-bold uppercase leading-[1.12] tracking-tight text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.85)] sm:text-4xl sm:leading-[1.1] lg:text-[2.35rem] lg:leading-[1.08]"
              >
                Tu próximo auto o la venta del tuyo, con el mismo equipo
              </h2>
              <p className="mt-5 max-w-xl font-sans text-sm leading-relaxed text-white/90 drop-shadow-[0_1px_10px_rgba(0,0,0,0.8)] sm:text-base">
                Asesoría en Bucaramanga para quien busca un vehículo revisado y para quien
                quiere tasar o vender el suyo con transparencia. Elige la opción que te
                corresponda y te respondemos por WhatsApp.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3">
              <a
                href={whatsappVehicleBuyHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[48px] w-full items-center justify-center bg-lcdv-highlight px-6 py-3 text-center font-sans text-sm font-bold uppercase tracking-wide text-lcdv-text-dark shadow-lg transition hover:brightness-110 sm:max-w-md"
                aria-label="Escribir por WhatsApp para comprar un vehículo"
              >
                Quiero comprar
              </a>
              <a
                href={whatsappVehicleSellHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[48px] w-full items-center justify-center border-2 border-white/45 px-6 py-3 text-center font-sans text-sm font-semibold uppercase tracking-wide text-white transition hover:border-lcdv-highlight hover:text-lcdv-highlight sm:max-w-md"
                aria-label="Escribir por WhatsApp para vender o tasar mi vehículo"
              >
                Quiero vender mi auto
              </a>
            </div>
          </div>
        </motion.div>
        </div>
      </div>

      <div className="border-t border-lcdv-gold-2/12 bg-lcdv-bg py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-lcdv-gold">
              Inventario
            </p>
            <h3 className="mt-3 font-display text-2xl font-semibold leading-tight text-lcdv-text sm:text-3xl">
              Vehículos disponibles
            </h3>
            <p className="mt-3 text-sm text-lcdv-text-2 sm:text-base">
              Ejemplos de lo que tenemos publicado. Precios y disponibilidad los confirmamos
              contigo por WhatsApp.
            </p>
          </div>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center rounded-full border-2 border-lcdv-highlight px-5 py-2.5 text-sm font-semibold text-lcdv-text transition-colors hover:bg-lcdv-highlight hover:text-lcdv-text-dark"
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
          <div className="mt-12 rounded-2xl border border-lcdv-highlight/35 bg-lcdv-bronze/10 px-6 py-12 text-center">
            <p className="text-sm text-lcdv-text-2 sm:text-base">
              En este momento no hay vehículos publicados en la web. Escribe por WhatsApp y
              te contamos el inventario disponible.
            </p>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center justify-center rounded-full border-2 border-lcdv-highlight px-6 py-2.5 text-sm font-semibold text-lcdv-text transition-colors hover:bg-lcdv-highlight hover:text-lcdv-text-dark"
            >
              Consultar por WhatsApp
            </a>
          </div>
        ) : (
          <ul
            id="listado-vehiculos-publicados"
            className="mt-12 grid gap-8 md:grid-cols-3"
          >
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
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                      <h4 className="font-display text-lg font-semibold text-lcdv-text">
                        {v.name}
                      </h4>
                      {v.vehicleBrand ? (
                        <span
                          className="inline-flex max-w-full shrink-0 rounded-full border border-lcdv-highlight/40 bg-lcdv-gold/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-lcdv-highlight"
                          title={`Marca: ${v.vehicleBrand}`}
                        >
                          {v.vehicleBrand}
                        </span>
                      ) : null}
                    </div>
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
                          <span className="text-sm font-medium text-lcdv-muted">COP</span>
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
      </div>
    </section>
  );
};
