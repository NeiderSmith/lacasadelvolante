"use client";

import { getUrl, remove, uploadData } from "aws-amplify/storage";
import { CATEGORY_IMAGE_S3_PREFIX } from "@/lib/storage-paths";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxBytes = 8 * 1024 * 1024;

export const assertCategoryImageFile = (file: File): string | null => {
  if (!allowedTypes.has(file.type)) {
    return "Formato no permitido. Usa JPEG, PNG o WebP.";
  }
  if (file.size > maxBytes) {
    return "La imagen no debe superar 8 MB.";
  }
  return null;
};

const extensionForMime = (mime: string): string => {
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  return "jpg";
};

export const uploadCategoryCoverImage = async (
  file: File,
  slug: string,
): Promise<string> => {
  const validationError = assertCategoryImageFile(file);
  if (validationError) {
    throw new Error(validationError);
  }
  const safe =
    slug.replace(/[^a-z0-9-]/g, "").slice(0, 80) || "categoria";
  const id =
    typeof globalThis.crypto !== "undefined" &&
    typeof globalThis.crypto.randomUUID === "function"
      ? globalThis.crypto.randomUUID()
      : String(Date.now());
  const path = `${CATEGORY_IMAGE_S3_PREFIX}/${safe}-${id}.${extensionForMime(file.type)}`;
  const task = uploadData({
    path,
    data: file,
    options: {
      contentType: file.type,
    },
  });
  await task.result;
  return path;
};

export const getCategoryCoverUrl = async (
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

export const removeCategoryCoverImage = async (
  key: string | null | undefined,
): Promise<void> => {
  if (!key?.trim()) return;
  try {
    await remove({ path: key.trim() });
  } catch {
    /* best effort */
  }
};
