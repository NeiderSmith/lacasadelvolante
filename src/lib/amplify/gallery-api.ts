"use client";

import { fetchAuthSession } from "aws-amplify/auth";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@amplify/data/resource";
import { getCategoryCoverUrl } from "@/lib/amplify/category-image-storage";
import { getGalleryWorkImageUrl } from "@/lib/amplify/gallery-item-image-storage";
import type {
  GalleryCategoryDisplay,
  GalleryLayoutType,
  GalleryWorkDisplay,
  GalleryWorkTile,
} from "@/lib/gallery-types";
import { configureAmplifyClient } from "@/lib/amplify/configure";

const clientIdentityPool = () =>
  generateClient<Schema>({ authMode: "identityPool" });

const clientUserPool = () =>
  generateClient<Schema>({ authMode: "userPool" });

const getGalleryListClient = async () => {
  try {
    const session = await fetchAuthSession();
    if (session.tokens?.idToken) {
      return clientUserPool();
    }
  } catch {
    /* sin sesión */
  }
  return clientIdentityPool();
};

const asLayoutType = (raw: string | null | undefined): GalleryLayoutType =>
  raw === "BEFORE_AFTER" ? "BEFORE_AFTER" : "SINGLE";

type GalleryItemRow = {
  id: string;
  layoutType: string | null;
  vehicleBrand: string | null;
  title: string;
  body: string | null;
  imageKeySingle: string | null;
  imageKeyBefore: string | null;
  imageKeyAfter: string | null;
  sortOrder: number | null;
  isPublished: boolean | null;
};

type GalleryLinkRow = {
  galleryItemId: string;
  galleryCategoryId: string;
};

export const fetchPublishedGalleryCategories =
  async (): Promise<GalleryCategoryDisplay[]> => {
    if (!configureAmplifyClient()) return [];

    const dataClient = await getGalleryListClient();

    const catModel = dataClient.models.GalleryCategory;
    if (!catModel?.list) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[GalleryCategory] modelo no disponible en outputs.");
      }
      return [];
    }

    const { data: catRows, errors: catErrors } = await catModel.list();
    if (catErrors?.length) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[GalleryCategory.list]", catErrors);
      }
      return [];
    }

    const categories = catRows ?? [];
    const publishedCats = categories.filter((r) => r.isPublished !== false);
    if (publishedCats.length === 0) return [];

    const sortedCats = [...publishedCats].sort(
      (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
    );

    const itemModel = dataClient.models.GalleryItem;
    let allItems: GalleryItemRow[] = [];
    if (itemModel?.list) {
      const { data: itemRows, errors: itemErrors } = await itemModel.list();
      if (!itemErrors?.length && itemRows) {
        allItems = itemRows as GalleryItemRow[];
      }
    }

    const itemById = new Map(
      allItems
        .filter((it) => it.isPublished !== false)
        .map((it) => [it.id, it]),
    );

    const linkModel = dataClient.models.GalleryItemCategoryLink;
    let allLinks: GalleryLinkRow[] = [];
    if (linkModel?.list) {
      const { data: linkRows, errors: linkErrors } = await linkModel.list();
      if (!linkErrors?.length && linkRows) {
        allLinks = linkRows as GalleryLinkRow[];
      }
    }

    const categoryToItemIds = new Map<string, string[]>();
    for (const link of allLinks) {
      const iid = link.galleryItemId;
      const cid = link.galleryCategoryId;
      if (!iid || !cid) continue;
      const arr = categoryToItemIds.get(cid) ?? [];
      arr.push(iid);
      categoryToItemIds.set(cid, arr);
    }

    const mapped = await Promise.all(
      sortedCats.map(async (r) => {
        const coverImageUrl = await getCategoryCoverUrl(
          r.coverImageKey ?? undefined,
        );
        const rawIds = [...new Set(categoryToItemIds.get(r.id) ?? [])];
        const rawItems = rawIds
          .map((id) => itemById.get(id))
          .filter((x): x is GalleryItemRow => Boolean(x));
        rawItems.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

        const works: GalleryWorkDisplay[] = await Promise.all(
          rawItems.map(async (it) => {
            const layoutType = asLayoutType(it.layoutType);
            const [imageSingleUrl, imageBeforeUrl, imageAfterUrl] =
              await Promise.all([
                getGalleryWorkImageUrl(it.imageKeySingle ?? undefined),
                getGalleryWorkImageUrl(it.imageKeyBefore ?? undefined),
                getGalleryWorkImageUrl(it.imageKeyAfter ?? undefined),
              ]);
            return {
              id: it.id,
              layoutType,
              vehicleBrand: it.vehicleBrand?.trim() || null,
              title: it.title,
              body: it.body?.trim() ?? "",
              imageSingleUrl,
              imageBeforeUrl,
              imageAfterUrl,
              sortOrder: it.sortOrder ?? 0,
            } satisfies GalleryWorkDisplay;
          }),
        );

        return {
          slug: r.slug,
          label: r.label,
          description: r.shortDescription ?? "",
          coverImageUrl,
          works,
        } satisfies GalleryCategoryDisplay;
      }),
    );

    return mapped;
  };

/** Une categorías en fichas únicas por `GalleryItem` (mantiene todas las categorías asociadas). */
export const buildGalleryWorkTiles = (
  categories: readonly GalleryCategoryDisplay[],
): GalleryWorkTile[] => {
  const byId = new Map<
    string,
    { work: GalleryWorkDisplay; slugs: Set<string>; labels: Set<string> }
  >();
  for (const cat of categories) {
    for (const w of cat.works) {
      const cur = byId.get(w.id);
      if (!cur) {
        byId.set(w.id, {
          work: w,
          slugs: new Set([cat.slug]),
          labels: new Set([cat.label]),
        });
      } else {
        cur.slugs.add(cat.slug);
        cur.labels.add(cat.label);
      }
    }
  }
  return [...byId.values()]
    .map(({ work, slugs, labels }) => ({
      ...work,
      categorySlugs: [...slugs],
      categoryLabels: [...labels],
    }))
    .sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title));
};
