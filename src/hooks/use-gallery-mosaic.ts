"use client";

import { useMemo } from "react";
import { buildGalleryWorkTiles } from "@/lib/amplify/gallery-api";
import { useGalleryCategories } from "@/hooks/use-gallery-categories";
import type { GalleryWorkTile } from "@/lib/gallery-types";

export const useGalleryMosaic = () => {
  const { categories, loading } = useGalleryCategories();
  const tiles = useMemo<GalleryWorkTile[]>(
    () => buildGalleryWorkTiles(categories),
    [categories],
  );
  const categoryFilters = useMemo(
    () =>
      categories.map((c) => ({
        slug: c.slug,
        label: c.label,
      })),
    [categories],
  );
  return { tiles, categoryFilters, loading };
};
