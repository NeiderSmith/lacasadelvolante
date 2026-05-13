export type GalleryLayoutType = "SINGLE" | "BEFORE_AFTER";

export type GalleryWorkDisplay = {
  readonly id: string;
  layoutType: GalleryLayoutType;
  vehicleBrand: string | null;
  title: string;
  body: string;
  imageSingleUrl: string | null;
  imageBeforeUrl: string | null;
  imageAfterUrl: string | null;
  sortOrder: number;
};

export type GalleryCategoryDisplay = {
  readonly slug: string;
  readonly label: string;
  readonly description: string;
  readonly coverImageUrl: string | null;
  readonly works: readonly GalleryWorkDisplay[];
};

/** Ítem plano para mosaico (un recurso puede estar en varias categorías). */
export type GalleryWorkTile = GalleryWorkDisplay & {
  readonly categorySlugs: readonly string[];
  readonly categoryLabels: readonly string[];
};
