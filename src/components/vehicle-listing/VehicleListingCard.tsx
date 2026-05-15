"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { PLACEHOLDER_IMAGE_SRC } from "@/lib/placeholder-image";
import type { VehicleListingDisplay } from "@/lib/vehicle-types";

export type VehicleListingCardProps = {
  readonly vehicle: VehicleListingDisplay;
  readonly whatsappHref: string;
  readonly listIndex?: number;
};

export const VehicleListingCard = ({
  vehicle: v,
  whatsappHref,
  listIndex = 0,
}: VehicleListingCardProps) => {
  const src = v.imageUrl ?? PLACEHOLDER_IMAGE_SRC;
  const remote = Boolean(v.imageUrl);

  return (
    <motion.li
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: listIndex * 0.06, duration: 0.4 }}
      className="lcdv-inventory-card group flex flex-col overflow-hidden rounded-2xl border border-lcdv-highlight/45 shadow-[0_28px_70px_rgba(1,7,14,0.45)]"
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
          <h4 className="font-display text-lg font-semibold text-lcdv-text">{v.name}</h4>
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
            <p className="text-[10px] font-medium uppercase tracking-wider text-lcdv-muted">Desde</p>
            <p className="font-display text-xl font-semibold text-lcdv-light sm:text-2xl">
              {v.price} <span className="text-sm font-medium text-lcdv-muted">COP</span>
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
};
