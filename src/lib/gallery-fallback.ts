import type { GalleryCategoryDisplay } from "@/lib/gallery-types";

/** Datos por defecto si Amplify no está configurado o la API falla. */
export const galleryFallbackCategories: readonly GalleryCategoryDisplay[] = [
  {
    slug: "volante",
    label: "Volante",
    description:
      "Tapizado y restauración de volantes deportivos, madera y cuero en Bucaramanga.",
    coverImageUrl: null,
    works: [],
  },
  {
    slug: "palanca",
    label: "Palanca",
    description: "Palanca de cambios y fundas a medida con materiales premium.",
    coverImageUrl: null,
    works: [],
  },
  {
    slug: "tablero",
    label: "Tablero",
    description: "Restauración de tableros, insertos y acabados metálicos o mate.",
    coverImageUrl: null,
    works: [],
  },
  {
    slug: "asientos",
    label: "Asientos",
    description: "Asientos delanteros y traseros con costuras personalizadas.",
    coverImageUrl: null,
    works: [],
  },
  {
    slug: "cielo-raso",
    label: "Cielo raso",
    description: "Cielos en alcántara, microfibra o tela técnica con acabado uniforme.",
    coverImageUrl: null,
    works: [],
  },
  {
    slug: "puertas-y-paneles",
    label: "Puertas y paneles",
    description: "Paneles de puerta, apoyabrazos y molduras coordinados con el interior.",
    coverImageUrl: null,
    works: [],
  },
];
