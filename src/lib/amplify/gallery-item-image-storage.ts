"use client";

import { getUrl, remove, uploadData } from "aws-amplify/storage";
import { assertCategoryImageFile } from "@/lib/amplify/category-image-storage";
import { GALLERY_WORK_IMAGE_S3_PREFIX } from "@/lib/storage-paths";

export const assertGalleryItemImageFile = assertCategoryImageFile;

const extensionForMime = (mime: string): string => {
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  return "jpg";
};

const safeSegment = (s: string): string => {
  const t = s.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return t.slice(0, 48) || "galeria";
};

export const uploadGalleryWorkImage = async (
  file: File,
  nameHint: string,
): Promise<string> => {
  const validationError = assertGalleryItemImageFile(file);
  if (validationError) {
    throw new Error(validationError);
  }
  const safe = safeSegment(nameHint);
  const id =
    typeof globalThis.crypto !== "undefined" &&
    typeof globalThis.crypto.randomUUID === "function"
      ? globalThis.crypto.randomUUID()
      : String(Date.now());
  const path = `${GALLERY_WORK_IMAGE_S3_PREFIX}/${safe}-${id}.${extensionForMime(file.type)}`;
  const task = uploadData({
    path,
    data: file,
    options: { contentType: file.type },
  });
  await task.result;
  return path;
};

export const getGalleryWorkImageUrl = async (
  key: string | null | undefined,
): Promise<string | null> => {
  if (!key?.trim()) return null;
  try {
    const { url } = await getUrl({ path: key.trim() });
    return url.toString();
  } catch {
    return null;
  }
};

export const removeGalleryWorkImage = async (
  key: string | null | undefined,
): Promise<void> => {
  if (!key?.trim()) return;
  try {
    await remove({ path: key.trim() });
  } catch {
    /* best effort */
  }
};
