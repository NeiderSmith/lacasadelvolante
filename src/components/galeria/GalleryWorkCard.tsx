"use client";

import Image from "next/image";
import { PLACEHOLDER_IMAGE_SRC } from "@/lib/placeholder-image";
import type { GalleryWorkDisplay } from "@/lib/gallery-types";

type GalleryWorkCardProps = {
  readonly work: GalleryWorkDisplay;
};

export const GalleryWorkCard = ({ work }: GalleryWorkCardProps) => {
  const brand = work.vehicleBrand?.trim();

  return (
    <article className="overflow-hidden rounded-2xl border border-lcdv-gold-2/18 bg-lcdv-bronze/15 shadow-lcdv-card">
      {work.layoutType === "BEFORE_AFTER" ? (
        <div className="grid grid-cols-1 gap-px bg-lcdv-gold-2/20 sm:grid-cols-2">
          <figure className="relative aspect-[4/3] bg-lcdv-bg">
            <span className="absolute left-2 top-2 z-10 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
              Antes
            </span>
            {work.imageBeforeUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={work.imageBeforeUrl}
                alt={`${work.title} — antes`}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <Image
                src={PLACEHOLDER_IMAGE_SRC}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            )}
          </figure>
          <figure className="relative aspect-[4/3] bg-lcdv-bg">
            <span className="absolute left-2 top-2 z-10 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
              Después
            </span>
            {work.imageAfterUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={work.imageAfterUrl}
                alt={`${work.title} — después`}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <Image
                src={PLACEHOLDER_IMAGE_SRC}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            )}
          </figure>
        </div>
      ) : (
        <div className="relative aspect-[16/10] bg-lcdv-bg">
          {work.imageSingleUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={work.imageSingleUrl}
              alt={work.title}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <Image
              src={PLACEHOLDER_IMAGE_SRC}
              alt={work.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 66vw"
            />
          )}
        </div>
      )}

      <div className="space-y-2 p-4 sm:p-5">
        {brand ? (
          <p className="text-[11px] font-semibold uppercase tracking-wider text-lcdv-muted">
            {brand}
          </p>
        ) : null}
        <h3 className="font-display text-lg font-semibold leading-snug text-lcdv-text">
          {work.title}
        </h3>
        {work.body ? (
          <p className="text-sm leading-relaxed text-lcdv-text-2">{work.body}</p>
        ) : null}
      </div>
    </article>
  );
};
