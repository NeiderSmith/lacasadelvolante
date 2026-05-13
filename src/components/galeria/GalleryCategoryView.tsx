"use client";

import Link from "next/link";
import Image from "next/image";
import { useGalleryCategories } from "@/hooks/use-gallery-categories";
import { PLACEHOLDER_IMAGE_SRC } from "@/lib/placeholder-image";
import { GalleryWorkCard } from "@/components/galeria/GalleryWorkCard";

type GalleryCategoryViewProps = {
  readonly slug: string;
};

export const GalleryCategoryView = ({ slug }: GalleryCategoryViewProps) => {
  const { categories, loading } = useGalleryCategories();
  const category = categories.find((c) => c.slug === slug);

  if (loading) {
    return (
      <div className="min-h-[50vh] bg-lcdv-bg px-4 py-20 text-center text-sm text-lcdv-muted sm:px-6">
        Cargando galería…
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-[50vh] bg-lcdv-bg px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-lg rounded-2xl border border-lcdv-gold-2/20 bg-lcdv-bronze/10 p-8 text-center">
          <p className="font-display text-xl font-semibold text-lcdv-text">
            Categoría no encontrada
          </p>
          <p className="mt-2 text-sm text-lcdv-text-2">
            Revisa el enlace o vuelve a la galería principal.
          </p>
          <Link
            href="/#galeria"
            className="mt-6 inline-flex rounded-full border border-lcdv-highlight px-5 py-2 text-sm font-semibold text-lcdv-text hover:bg-lcdv-gold/15"
          >
            Volver a la galería
          </Link>
        </div>
      </div>
    );
  }

  const coverAlt =
    category.description?.trim() ||
    `Trabajos de tapicería ${category.label} — La Casa del Volante`;

  return (
    <div className="bg-lcdv-bg pb-20 pt-24 sm:pb-28 sm:pt-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <nav className="text-sm text-lcdv-muted" aria-label="Migas de pan">
          <Link href="/#galeria" className="hover:text-lcdv-text">
            Galería
          </Link>
          <span className="mx-2" aria-hidden>
            /
          </span>
          <span className="text-lcdv-text">{category.label}</span>
        </nav>

        <header className="mt-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-lcdv-muted">
            Categoría
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-lcdv-text sm:text-4xl">
            {category.label}
          </h1>
          {category.description ? (
            <p className="mt-3 max-w-2xl text-base text-lcdv-text-2">
              {category.description}
            </p>
          ) : null}
        </header>

        <div className="relative mt-10 aspect-[21/9] max-h-72 overflow-hidden rounded-2xl border border-lcdv-gold-2/15 bg-lcdv-bronze/20">
          {category.coverImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={category.coverImageUrl}
              alt={coverAlt}
              className="h-full w-full object-cover"
            />
          ) : (
            <Image
              src={PLACEHOLDER_IMAGE_SRC}
              alt={coverAlt}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          )}
        </div>

        <section className="mt-14" aria-labelledby="trabajos-heading">
          <h2
            id="trabajos-heading"
            className="font-display text-2xl font-semibold text-lcdv-text"
          >
            Trabajos en esta categoría
          </h2>
          {category.works.length === 0 ? (
            <p className="mt-4 text-sm text-lcdv-muted">
              Aún no hay recursos publicados para esta categoría.
            </p>
          ) : (
            <ul className="mt-8 grid gap-8 sm:grid-cols-1 lg:grid-cols-2">
              {category.works.map((work) => (
                <li key={work.id}>
                  <GalleryWorkCard work={work} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};
