import type { Metadata } from "next";
import { GalleryCategoryView } from "@/components/galeria/GalleryCategoryView";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const label = slug.replace(/-/g, " ");
  return {
    title: `${label} — Galería — La Casa del Volante`,
    description: `Trabajos de tapicería y restauración: ${label}. Bucaramanga.`,
  };
}

export default async function GaleriaCategoriaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <GalleryCategoryView slug={slug} />;
}
