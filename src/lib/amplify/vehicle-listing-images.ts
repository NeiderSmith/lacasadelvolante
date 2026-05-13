"use client";

import { generateClient } from "aws-amplify/data";
import type { Schema } from "@amplify/data/resource";

export type DataClient = ReturnType<typeof generateClient<Schema>>;

export type VehicleListingImageRow = {
  readonly id: string;
  vehicleListingId: string;
  imageKey: string;
  imageAlt: string | null;
  sortOrder: number | null;
  isPrimary: boolean | null;
};

export const getVehicleListingImageModel = (client: DataClient) => {
  const m = client.models.VehicleListingImage;
  if (!m?.list) return null;
  return m;
};

export const listVehicleListingImagesAll = async (
  client: DataClient,
): Promise<VehicleListingImageRow[]> => {
  const m = getVehicleListingImageModel(client);
  if (!m) return [];
  const { data, errors } = await m.list();
  if (errors?.length) return [];
  return (data ?? []) as VehicleListingImageRow[];
};

export const groupVehicleImagesByListingId = (
  rows: readonly VehicleListingImageRow[],
): Map<string, VehicleListingImageRow[]> => {
  const map = new Map<string, VehicleListingImageRow[]>();
  for (const r of rows) {
    const vid = r.vehicleListingId;
    if (!vid) continue;
    const arr = map.get(vid) ?? [];
    arr.push(r);
    map.set(vid, arr);
  }
  for (const arr of map.values()) {
    arr.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }
  return map;
};

export const pickPrimaryVehicleImage = (
  images: readonly VehicleListingImageRow[],
): VehicleListingImageRow | null => {
  if (images.length === 0) return null;
  const explicit = images.find((i) => i.isPrimary === true);
  return explicit ?? images[0] ?? null;
};

/** Garantiza como máximo un `isPrimary` (el primero por orden) si hay filas. */
export const normalizePrimaryDrafts = <
  T extends { isPrimary: boolean; sortOrder: number },
>(
  drafts: readonly T[],
): T[] => {
  if (drafts.length === 0) return [];
  const sorted = [...drafts].sort((a, b) => a.sortOrder - b.sortOrder);
  const idx = sorted.findIndex((d) => d.isPrimary);
  const primaryAt = idx >= 0 ? idx : 0;
  return sorted.map((d, i) => ({
    ...d,
    isPrimary: i === primaryAt,
  }));
};

/** Tras guardar, alinea `isPrimary` en base de datos con una sola fila en true. */
export const normalizePrimaryInDatabase = async (
  client: DataClient,
  vehicleListingId: string,
): Promise<void> => {
  const m = client.models.VehicleListingImage;
  if (!m?.list || !m.update) return;
  const { data, errors } = await m.list();
  if (errors?.length) return;
  const rows = ((data ?? []) as VehicleListingImageRow[]).filter(
    (r) => r.vehicleListingId === vehicleListingId,
  );
  if (rows.length === 0) return;
  const sorted = [...rows].sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
  );
  const primary =
    sorted.find((r) => r.isPrimary === true)?.id ?? sorted[0]?.id ?? null;
  for (const r of sorted) {
    const should = r.id === primary;
    if ((r.isPrimary === true) !== should) {
      await m.update({ id: r.id, isPrimary: should });
    }
  }
};
