"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { PLACEHOLDER_IMAGE_SRC } from "@/lib/placeholder-image";
import { whatsappHref } from "@/lib/site-config";
import { hasAmplifyOutputsEnv } from "@/lib/amplify/configure";
import { useGalleryCategories } from "@/hooks/use-gallery-categories";

export const GallerySection = () => {
  const { categories, loading } = useGalleryCategories();

  const introDefault =
    "Tapicería automotriz y restauración de interiores en Bucaramanga. Cada categoría enlaza a su galería de trabajos.";

  return (
    <section
      id="galeria"
      className="scroll-mt-28 border-t border-lcdv-gold-2/12 bg-lcdv-bg py-20 sm:py-28"
      aria-labelledby="galeria-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-lcdv-muted">
              Galería
            </p>
            <h2
              id="galeria-heading"
              className="mt-3 font-display text-3xl font-semibold leading-tight text-lcdv-text sm:text-4xl"
            >
              Trabajos realizados
            </h2>
            <p className="mt-3 text-sm text-lcdv-text-2 sm:text-base">
              {introDefault}
            </p>
          </div>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center rounded-full border border-lcdv-gold-2/45 px-5 py-2.5 text-sm font-semibold text-lcdv-text transition-colors hover:border-lcdv-highlight hover:text-lcdv-light"
            aria-label="Consultar proyectos por WhatsApp"
          >
            Ver galería completa
          </a>
        </div>

        {loading ? (
          <p className="mt-10 text-sm text-lcdv-muted" aria-live="polite">
            Cargando categorías del catálogo…
          </p>
        ) : null}

        {!loading &&
        categories.length === 0 &&
        hasAmplifyOutputsEnv() ? (
          <div
            className="mt-12 rounded-2xl border border-lcdv-gold-2/20 bg-lcdv-bronze/10 px-6 py-10 text-center"
            role="status"
          >
            <p className="font-display text-lg font-semibold text-lcdv-text">
              Aún no hay categorías publicadas
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm text-lcdv-text-2">
              Cuando publiques categorías en el panel de administración (marcadas
              como visibles en la web), aparecerán aquí en la rejilla.
            </p>
          </div>
        ) : null}

        {categories.length > 0 ? (
          <ul
            className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            aria-label="Categorías de la galería"
          >
            {categories.map((cat, index) => {
              const workAlt =
                cat.description?.trim() ||
                `Tapicería automotriz ${cat.label} Bucaramanga — La Casa del Volante`;
              const workCount = cat.works.length;

              return (
                <motion.li
                  key={cat.slug}
                  id={`galeria-${cat.slug}`}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    delay: index * 0.04,
                    duration: 0.4,
                  }}
                  className="scroll-mt-28"
                >
                  <Link
                    href={`/galeria/${cat.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-lcdv-gold-2/15 bg-lcdv-bronze/20 shadow-lcdv-card transition-colors hover:border-lcdv-highlight/40 hover:shadow-lcdv-soft"
                  >
                    <div className="relative aspect-[4/3] shrink-0 overflow-hidden">
                      {cat.coverImageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element -- URL firmada S3 (Amplify getUrl)
                        <img
                          src={cat.coverImageUrl}
                          alt={workAlt}
                          loading="lazy"
                          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <Image
                          src={PLACEHOLDER_IMAGE_SRC}
                          alt={workAlt}
                          fill
                          loading="lazy"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover transition duration-500 group-hover:scale-[1.03]"
                        />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-4 sm:p-5">
                      <p className="font-display text-lg font-semibold leading-snug text-lcdv-text">
                        {cat.label}
                      </p>
                      {cat.description ? (
                        <p className="mt-2 line-clamp-2 text-xs text-lcdv-text-2 sm:text-sm">
                          {cat.description}
                        </p>
                      ) : null}
                      <p className="mt-2 text-[11px] font-medium uppercase tracking-wide text-lcdv-muted">
                        {workCount === 0
                          ? "Sin recursos aún"
                          : `${workCount} recurso${workCount === 1 ? "" : "s"}`}
                      </p>
                      <span className="mt-3 inline-flex text-xs font-semibold text-lcdv-highlight group-hover:text-lcdv-light sm:text-sm">
                        Ver trabajos →
                      </span>
                    </div>
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        ) : null}
      </div>
    </section>
  );
};
