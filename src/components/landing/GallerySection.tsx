"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { hasAmplifyOutputsEnv } from "@/lib/amplify/configure";
import { useGalleryMosaic } from "@/hooks/use-gallery-mosaic";
import type { GalleryWorkTile } from "@/lib/gallery-types";

const PAGE_SLOT_CAPACITY = 12;

const LIGHTBOX_TITLE_ID = "gallery-lightbox-title";

const tileSlotCount = (t: GalleryWorkTile): number =>
  t.layoutType === "BEFORE_AFTER" ? 2 : 1;

/** Pagina por “huecos” de rejilla: cada antes/después cuenta como 2. */
const buildSlotPages = (
  items: readonly GalleryWorkTile[],
  slotsPerPage: number,
): GalleryWorkTile[][] => {
  const pages: GalleryWorkTile[][] = [];
  let current: GalleryWorkTile[] = [];
  let used = 0;

  for (const tile of items) {
    const need = tileSlotCount(tile);
    if (used > 0 && used + need > slotsPerPage) {
      pages.push(current);
      current = [];
      used = 0;
    }
    current.push(tile);
    used += need;
    if (used >= slotsPerPage) {
      pages.push(current);
      current = [];
      used = 0;
    }
  }
  if (current.length > 0) {
    pages.push(current);
  }
  return pages;
};

const normalizeForGallerySearch = (value: string): string =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "");

const hasRenderableMedia = (t: GalleryWorkTile): boolean => {
  if (t.layoutType === "BEFORE_AFTER") {
    return Boolean(t.imageBeforeUrl && t.imageAfterUrl);
  }
  return Boolean(t.imageSingleUrl);
};

type GalleryLightboxProps = {
  readonly tile: GalleryWorkTile;
  readonly onClose: () => void;
};

const GalleryLightbox = ({ tile, onClose }: GalleryLightboxProps) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const descriptionId = useId();

  const heading =
    tile.title.trim().length > 0 ? tile.title.trim() : "Vista ampliada del trabajo";

  const categoryLine = tile.categoryLabels.length
    ? tile.categoryLabels.join(" · ")
    : null;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  const handleBackdropClick = () => {
    onClose();
  };

  const panel = (
    <div className="fixed inset-0 z-[100]" role="presentation">
      <div
        className="fixed inset-0 cursor-default bg-black/82 backdrop-blur-[2px]"
        onClick={handleBackdropClick}
        aria-hidden
      />

      <div
        className="pointer-events-none fixed inset-0 z-[101] flex items-center justify-center p-3 sm:p-5"
        role="presentation"
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={LIGHTBOX_TITLE_ID}
          aria-describedby={categoryLine ? descriptionId : undefined}
          className="pointer-events-auto relative flex h-[min(82vh,680px)] w-[min(94vw,1040px)] max-w-none flex-col overflow-hidden rounded-lg border border-lcdv-highlight/35 bg-lcdv-bg shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
        >
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-lcdv-gold-2/15 bg-lcdv-bronze/20 px-4 py-3 sm:px-5">
          <div className="min-w-0 flex-1">
            <h3
              id={LIGHTBOX_TITLE_ID}
              className="font-display text-base font-semibold leading-snug text-lcdv-text sm:text-lg"
            >
              {heading}
            </h3>
            {categoryLine ? (
              <p id={descriptionId} className="mt-1 text-xs text-lcdv-text-2 sm:text-sm">
                {categoryLine}
              </p>
            ) : null}
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-md border border-lcdv-gold-2/35 bg-lcdv-bg px-3 py-2 text-sm font-semibold text-lcdv-text transition hover:border-lcdv-highlight hover:text-lcdv-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lcdv-highlight"
            aria-label="Cerrar"
          >
            Cerrar
          </button>
        </div>

        <div className="relative min-h-0 flex-1 bg-black/40 p-2 sm:p-4">
          {tile.layoutType === "BEFORE_AFTER" &&
          tile.imageBeforeUrl &&
          tile.imageAfterUrl ? (
            <div className="grid h-full min-h-0 grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
              <figure className="flex min-h-0 flex-col gap-2">
                <figcaption className="shrink-0 text-center text-[11px] font-bold uppercase tracking-wider text-white/90">
                  Antes
                </figcaption>
                <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-md bg-lcdv-bg ring-1 ring-white/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={tile.imageBeforeUrl}
                    alt={`Estado anterior del trabajo: ${heading}`}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              </figure>
              <figure className="flex min-h-0 flex-col gap-2">
                <figcaption className="shrink-0 text-center text-[11px] font-bold uppercase tracking-wider text-lcdv-highlight">
                  Después
                </figcaption>
                <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-md bg-lcdv-bg ring-1 ring-lcdv-highlight/35">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={tile.imageAfterUrl}
                    alt={`Estado posterior del trabajo: ${heading}`}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              </figure>
            </div>
          ) : tile.imageSingleUrl ? (
            <div className="flex h-full min-h-0 items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={tile.imageSingleUrl}
                alt={`Imagen del trabajo: ${heading}`}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          ) : null}
        </div>
      </div>
      </div>
    </div>
  );

  if (typeof document === "undefined") return null;
  return createPortal(panel, document.body);
};

type GalleryTileOpenProps = {
  readonly tile: GalleryWorkTile;
  readonly onOpen: (tile: GalleryWorkTile) => void;
};

const GallerySingleTile = ({ tile, onOpen }: GalleryTileOpenProps) => {
  const url = tile.imageSingleUrl;
  const label =
    tile.title.trim().length > 0
      ? `Ampliar imagen: ${tile.title.trim()}`
      : "Ampliar imagen del trabajo";
  if (!url) return null;
  return (
    <motion.li
      layout
      initial={{ opacity: 0, scale: 0.97 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.35 }}
      className="h-full min-h-0 w-full min-w-0"
    >
      <button
        type="button"
        onClick={() => onOpen(tile)}
        aria-haspopup="dialog"
        aria-label={label}
        className="group relative flex h-full w-full min-h-0 min-w-0 cursor-pointer overflow-hidden rounded-md border-0 bg-transparent p-0 text-left ring-1 ring-lcdv-highlight/25 transition duration-300 hover:ring-lcdv-highlight/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lcdv-highlight"
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- URL firmada S3 */}
        <img
          src={url}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition group-hover:opacity-100"
          aria-hidden
        />
      </button>
    </motion.li>
  );
};

const GalleryBeforeAfterTile = ({ tile, onOpen }: GalleryTileOpenProps) => {
  const before = tile.imageBeforeUrl;
  const after = tile.imageAfterUrl;
  const label =
    tile.title.trim().length > 0
      ? `Ampliar comparación antes y después: ${tile.title.trim()}`
      : "Ampliar comparación antes y después";
  if (!before || !after) return null;
  return (
    <motion.li
      layout
      initial={{ opacity: 0, scale: 0.97 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.38 }}
      className="col-span-2 h-full min-h-0 w-full min-w-0"
    >
      <button
        type="button"
        onClick={() => onOpen(tile)}
        aria-haspopup="dialog"
        aria-label={label}
        className="group relative flex h-full w-full min-h-0 min-w-0 cursor-pointer overflow-hidden rounded-md border-0 bg-transparent p-0 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lcdv-highlight"
      >
        <div className="absolute inset-0 grid grid-cols-2 gap-px bg-lcdv-highlight/90 p-px">
          <div className="relative min-h-0 overflow-hidden bg-lcdv-bg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={before}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            />
            <span className="pointer-events-none absolute left-2 top-2 rounded-sm bg-black/75 px-2 py-1 font-sans text-[10px] font-bold uppercase tracking-wider text-white/95">
              Antes
            </span>
          </div>
          <div className="relative min-h-0 overflow-hidden bg-lcdv-bg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={after}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            />
            <span className="pointer-events-none absolute right-2 top-2 rounded-sm bg-lcdv-highlight px-2 py-1 font-sans text-[10px] font-bold uppercase tracking-wider text-lcdv-text-dark">
              Después
            </span>
          </div>
        </div>
        <div
          className="pointer-events-none absolute left-1/2 top-0 z-10 h-full w-px -translate-x-1/2 bg-gradient-to-b from-lcdv-highlight via-lcdv-highlight to-transparent opacity-90"
          aria-hidden
        />
      </button>
    </motion.li>
  );
};

export const GallerySection = () => {
  const { tiles: rawTiles, categoryFilters, loading } = useGalleryMosaic();
  const [categorySlug, setCategorySlug] = useState("");
  const [brand, setBrand] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [lightboxTile, setLightboxTile] = useState<GalleryWorkTile | null>(null);

  const handleOpenLightbox = useCallback((tile: GalleryWorkTile) => {
    setLightboxTile(tile);
  }, []);

  const handleCloseLightbox = useCallback(() => {
    setLightboxTile(null);
  }, []);

  const tiles = useMemo(
    () => rawTiles.filter(hasRenderableMedia),
    [rawTiles],
  );

  const brandOptions = useMemo(() => {
    const s = new Set<string>();
    for (const t of tiles) {
      const b = t.vehicleBrand?.trim();
      if (b) s.add(b);
    }
    return [...s].sort((a, b) => a.localeCompare(b, "es"));
  }, [tiles]);

  const filtered = useMemo(() => {
    let list = tiles;
    if (categorySlug) {
      list = list.filter((t) => t.categorySlugs.includes(categorySlug));
    }
    if (brand) {
      const b = brand.toLowerCase();
      list = list.filter((t) => (t.vehicleBrand ?? "").trim().toLowerCase() === b);
    }
    const q = searchQuery.trim();
    if (q) {
      const needle = normalizeForGallerySearch(q);
      list = list.filter((t) => {
        const hay = normalizeForGallerySearch(`${t.title}\n${t.body}`);
        return hay.includes(needle);
      });
    }
    return list;
  }, [tiles, categorySlug, brand, searchQuery]);

  const slotPages = useMemo(
    () => buildSlotPages(filtered, PAGE_SLOT_CAPACITY),
    [filtered],
  );

  const pageCount = Math.max(1, slotPages.length);
  const safePage = Math.min(page, pageCount);
  const slice = slotPages[safePage - 1] ?? [];

  const usedSlotsOnPage = useMemo(
    () => slice.reduce((acc, t) => acc + tileSlotCount(t), 0),
    [slice],
  );

  const firstPagePlaceholderSlots =
    !loading && safePage === 1 && slice.length > 0 && usedSlotsOnPage < PAGE_SLOT_CAPACITY
      ? PAGE_SLOT_CAPACITY - usedSlotsOnPage
      : 0;

  useEffect(() => {
    setPage(1);
  }, [categorySlug, brand, searchQuery, tiles.length]);

  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  const showEmpty = !loading && tiles.length === 0 && hasAmplifyOutputsEnv();

  return (
    <section
      id="galeria"
      className="scroll-mt-28 border-t border-lcdv-gold-2/12 bg-lcdv-bg"
      aria-labelledby="galeria-heading"
    >
      <div className="mx-auto max-w-7xl px-4 pb-3 pt-10 sm:px-6 sm:pb-4 sm:pt-12 lg:px-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-lcdv-gold">
          Trabajos realizados
        </p>
        <h2
          id="galeria-heading"
          className="mt-3 font-display text-3xl font-semibold leading-tight text-lcdv-text sm:text-4xl"
        >
          Galería
        </h2>
      </div>

      <div className="sticky top-14 z-20 border-b border-lcdv-gold-2/10 bg-lcdv-bg/90 py-3 backdrop-blur-md sm:top-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-3 sm:px-4 lg:flex-row lg:items-stretch lg:gap-4 lg:px-8">
          <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-1">
            <label
              className="text-[11px] font-medium uppercase tracking-wide text-lcdv-text-2"
              htmlFor="gallery-search"
            >
              Buscar
            </label>
            <input
              id="gallery-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Título o descripción…"
              autoComplete="off"
              className="min-h-[44px] w-full rounded-md border border-lcdv-gold-2/35 bg-lcdv-bg px-3 py-2 text-sm text-lcdv-text placeholder:text-lcdv-muted/90 focus-visible:border-lcdv-highlight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-lcdv-highlight"
              aria-label="Buscar en la galería por título o descripción"
            />
          </div>
          <div className="grid shrink-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:gap-3">
            <div className="flex min-w-0 flex-col gap-1 lg:w-[min(100%,14rem)]">
              <label
                className="text-[11px] font-medium uppercase tracking-wide text-lcdv-text-2"
                htmlFor="gallery-filter-category"
              >
                Categoría
              </label>
              <select
                id="gallery-filter-category"
                value={categorySlug}
                onChange={(e) => setCategorySlug(e.target.value)}
                aria-label="Filtrar por categoría"
                className="min-h-[44px] w-full rounded-md border border-lcdv-gold-2/30 bg-lcdv-bg px-3 py-2 text-sm font-medium text-lcdv-text"
              >
                <option value="">Todas</option>
                {categoryFilters.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex min-w-0 flex-col gap-1 lg:w-[min(100%,14rem)]">
              <label
                className="text-[11px] font-medium uppercase tracking-wide text-lcdv-text-2"
                htmlFor="gallery-filter-brand"
              >
                Marca
              </label>
              <select
                id="gallery-filter-brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                aria-label="Filtrar por marca del vehículo"
                className="min-h-[44px] w-full rounded-md border border-lcdv-gold-2/30 bg-lcdv-bg px-3 py-2 text-sm font-medium text-lcdv-text"
              >
                <option value="">Todas</option>
                {brandOptions.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-2 py-4 sm:px-4 sm:py-6 lg:px-8">
        {loading ? (
          <ul
            className="grid grid-cols-2 auto-rows-[minmax(11rem,26vw)] gap-2 sm:auto-rows-[minmax(11.5rem,22vw)] sm:gap-3 md:grid-cols-3 md:auto-rows-[minmax(12rem,18vw)] lg:grid-cols-4 lg:auto-rows-[minmax(12.5rem,15vw)]"
            aria-busy="true"
            aria-label="Cargando galería"
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <li
                key={i}
                className="h-full min-h-0 animate-pulse rounded-md bg-lcdv-bronze/25 ring-1 ring-lcdv-gold-2/10"
              />
            ))}
          </ul>
        ) : null}

        {showEmpty ? (
          <div
            className="flex min-h-[30vh] items-center justify-center rounded-md border border-dashed border-lcdv-gold-2/20 bg-lcdv-bronze/10"
            role="status"
          >
            <span className="sr-only">No hay imágenes publicadas en la galería</span>
          </div>
        ) : null}

        {!loading && slice.length === 0 && tiles.length > 0 ? (
          <div
            className="flex min-h-[24vh] items-center justify-center rounded-md border border-lcdv-gold-2/15 bg-lcdv-bronze/10"
            role="status"
          >
            <span className="sr-only">Sin resultados con los filtros seleccionados</span>
          </div>
        ) : null}

        {!loading && slice.length > 0 ? (
          <>
            <ul className="grid grid-cols-2 auto-rows-[minmax(11rem,26vw)] gap-2 sm:auto-rows-[minmax(11.5rem,22vw)] sm:gap-3 md:grid-cols-3 md:auto-rows-[minmax(12rem,18vw)] lg:grid-cols-4 lg:auto-rows-[minmax(12.5rem,15vw)]">
              {slice.map((tile) =>
                tile.layoutType === "BEFORE_AFTER" ? (
                  <GalleryBeforeAfterTile
                    key={tile.id}
                    tile={tile}
                    onOpen={handleOpenLightbox}
                  />
                ) : (
                  <GallerySingleTile
                    key={tile.id}
                    tile={tile}
                    onOpen={handleOpenLightbox}
                  />
                ),
              )}
              {Array.from({ length: firstPagePlaceholderSlots }).map((_, i) => (
                <li
                  key={`gallery-page-placeholder-${i}`}
                  aria-hidden
                  className="h-full min-h-0 rounded-md border border-dashed border-lcdv-gold-2/30 bg-lcdv-bronze/12 ring-1 ring-lcdv-highlight/15"
                />
              ))}
            </ul>

            <nav
              className="mt-8 flex flex-wrap items-center justify-center gap-2 pb-6"
              aria-label="Paginación de la galería"
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
              {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
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

        {lightboxTile ? (
          <GalleryLightbox tile={lightboxTile} onClose={handleCloseLightbox} />
        ) : null}
      </div>
    </section>
  );
};
