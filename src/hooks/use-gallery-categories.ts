"use client";

import { useEffect, useState } from "react";
import { galleryFallbackCategories } from "@/lib/gallery-fallback";
import { fetchPublishedGalleryCategories } from "@/lib/amplify/gallery-api";
import { hasAmplifyOutputsEnv } from "@/lib/amplify/configure";
import type { GalleryCategoryDisplay } from "@/lib/gallery-types";

/**
 * Categorías de la galería:
 * - Con Amplify configurado: solo las publicadas en el panel (sin fallback estático).
 * - Sin backend local: datos de ejemplo en `galleryFallbackCategories`.
 */
export const useGalleryCategories = () => {
  const [categories, setCategories] = useState<GalleryCategoryDisplay[]>(() =>
    hasAmplifyOutputsEnv() ? [] : [...galleryFallbackCategories],
  );
  const [loading, setLoading] = useState(() => hasAmplifyOutputsEnv());

  useEffect(() => {
    if (!hasAmplifyOutputsEnv()) return;

    let cancelled = false;

    const load = async () => {
      const fromApi = await fetchPublishedGalleryCategories();
      if (cancelled) return;
      setCategories(fromApi);
      setLoading(false);
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { categories, loading };
};
