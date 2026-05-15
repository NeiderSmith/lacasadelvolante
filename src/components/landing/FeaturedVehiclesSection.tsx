"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useFeaturedVehicles } from "@/hooks/use-featured-vehicles";
import { hasAmplifyOutputsEnv } from "@/lib/amplify/configure";
import { SectionHeader } from "@/components/landing/SectionHeader";
import { VehicleListingCard } from "@/components/vehicle-listing/VehicleListingCard";
import {
  whatsappHref,
  whatsappVehicleBuyHref,
  whatsappVehicleSellHref,
} from "@/lib/site-config";

const VEHICLE_GRID_ROWS = 2;

const getVehiclesPerPage = (viewportWidth: number): number => {
  if (viewportWidth >= 1024) return 3 * VEHICLE_GRID_ROWS;
  if (viewportWidth >= 640) return 2 * VEHICLE_GRID_ROWS;
  return 1 * VEHICLE_GRID_ROWS;
};

const useVehiclesPerPage = () => {
  const [perPage, setPerPage] = useState(() =>
    typeof window === "undefined" ? 6 : getVehiclesPerPage(window.innerWidth),
  );

  useEffect(() => {
    const handleResize = () => setPerPage(getVehiclesPerPage(window.innerWidth));
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return perPage;
};

export const FeaturedVehiclesSection = () => {
  const { vehicles, loading } = useFeaturedVehicles();
  const useRemote = hasAmplifyOutputsEnv();
  const perPage = useVehiclesPerPage();
  const [page, setPage] = useState(1);

  const pageCount = Math.max(1, Math.ceil(vehicles.length / perPage));
  const safePage = Math.min(page, pageCount);

  const paginatedVehicles = useMemo(
    () => vehicles.slice((safePage - 1) * perPage, safePage * perPage),
    [vehicles, safePage, perPage],
  );

  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  useEffect(() => {
    setPage(1);
  }, [perPage, vehicles.length]);

  const showInventoryGrid = !loading && !(vehicles.length === 0 && useRemote);

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
                quiere vender el suyo con transparencia. Elige la opción que te
                corresponda y te respondemos por WhatsApp.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3">
              <a
                href={whatsappVehicleBuyHref}
                target="_blank"
                rel="noopener noreferrer"
                className="lcdv-btn-primary w-full sm:max-w-md"
                aria-label="Escribir por WhatsApp para comprar un vehículo"
              >
                Quiero comprar
              </a>
              <a
                href={whatsappVehicleSellHref}
                target="_blank"
                rel="noopener noreferrer"
                className="lcdv-btn-ghost-light w-full sm:max-w-md"
                aria-label="Escribir por WhatsApp para vender mi vehículo"
              >
                Quiero vender mi auto
              </a>
            </div>
          </div>
        </motion.div>
        </div>
      </div>

      <div className="lcdv-section-textured border-t border-lcdv-gold-2/12 py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end sm:gap-8">
          <SectionHeader
            eyebrow="Inventario"
            title="Vehículos disponibles"
            titleId="vehiculos-inventario-heading"
            description="Ejemplos de lo que tenemos publicado. Precios y disponibilidad los confirmamos contigo por WhatsApp."
            variant="on-textured"
            className="min-w-0 flex-1 max-w-2xl"
          />
          <Link
            href="/vehiculos"
            className="lcdv-btn-secondary shrink-0 self-start sm:self-end !min-h-[44px] !px-5 !py-2.5 !text-sm"
            aria-label="Ver todo el inventario de vehículos en el marketplace"
          >
            Ver todo
          </Link>
        </div>

        {loading ? (
          <ul
            className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3"
            aria-busy="true"
            aria-label="Cargando vehículos"
          >
            {Array.from({ length: perPage }, (_, i) => (
              <li
                key={i}
                className="lcdv-inventory-card overflow-hidden rounded-2xl border border-lcdv-highlight/30"
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
          <div className="lcdv-textured-panel mt-12 px-6 py-12 text-center">
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
        ) : showInventoryGrid ? (
          <>
          <ul
            id="listado-vehiculos-publicados"
            className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3"
          >
            {paginatedVehicles.map((v, i) => (
              <VehicleListingCard
                key={v.id}
                vehicle={v}
                whatsappHref={whatsappHref}
                listIndex={i}
              />
            ))}
          </ul>

          <nav
            className="mt-8 flex flex-wrap items-center justify-center gap-2 pb-2"
            aria-label="Paginación del inventario de vehículos"
          >
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="min-h-[44px] min-w-[44px] rounded border border-lcdv-gold-2/35 px-3 text-sm font-medium text-lcdv-text transition enabled:hover:border-lcdv-highlight enabled:hover:text-lcdv-light disabled:opacity-35"
              aria-label="Página anterior"
            >
              ←
            </button>
            {Array.from({ length: pageCount }, (_, idx) => idx + 1).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setPage(n)}
                className={
                  n === safePage
                    ? "min-h-[44px] min-w-[44px] rounded bg-lcdv-highlight px-3 text-sm font-semibold text-lcdv-text-dark"
                    : "min-h-[44px] min-w-[44px] rounded border border-lcdv-gold-2/25 px-3 text-sm text-lcdv-text-2 transition hover:border-lcdv-highlight hover:text-lcdv-text"
                }
                aria-label={`Ir a la página ${n}`}
                aria-current={n === safePage ? "page" : undefined}
              >
                {n}
              </button>
            ))}
            <button
              type="button"
              disabled={safePage >= pageCount}
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              className="min-h-[44px] min-w-[44px] rounded border border-lcdv-gold-2/35 px-3 text-sm font-medium text-lcdv-text transition enabled:hover:border-lcdv-highlight enabled:hover:text-lcdv-light disabled:opacity-35"
              aria-label="Página siguiente"
            >
              →
            </button>
          </nav>
          </>
        ) : null}
        </div>
      </div>
    </section>
  );
};
