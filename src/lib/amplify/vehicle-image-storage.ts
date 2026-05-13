"use client";



import { getUrl, remove, uploadData } from "aws-amplify/storage";

import { assertCategoryImageFile } from "@/lib/amplify/category-image-storage";

import { VEHICLE_IMAGE_S3_PREFIX } from "@/lib/storage-paths";



export const assertVehicleImageFile = assertCategoryImageFile;



const extensionForMime = (mime: string): string => {

  if (mime === "image/png") return "png";

  if (mime === "image/webp") return "webp";

  return "jpg";

};



const safeNameBase = (name: string): string => {

  const t = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  return t.slice(0, 60) || "vehiculo";

};



export const uploadVehicleListingImage = async (

  file: File,

  nameForPath: string,

): Promise<string> => {

  const validationError = assertVehicleImageFile(file);

  if (validationError) {

    throw new Error(validationError);

  }

  const safe = safeNameBase(nameForPath);

  const id =

    typeof globalThis.crypto !== "undefined" &&

    typeof globalThis.crypto.randomUUID === "function"

      ? globalThis.crypto.randomUUID()

      : String(Date.now());

  const path = `${VEHICLE_IMAGE_S3_PREFIX}/${safe}-${id}.${extensionForMime(file.type)}`;

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



export const getVehicleListingImageUrl = async (

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



export const removeVehicleListingImage = async (

  key: string | null | undefined,

): Promise<void> => {

  if (!key?.trim()) return;

  try {

    await remove({ path: key.trim() });

  } catch {

    /* best effort */

  }

};


