import type { VehicleListingDisplay } from "@/lib/vehicle-types";

export const VEHICLE_TYPE_LABELS = [
  "SUV",
  "Sedán",
  "Pickup",
  "Coupé",
  "Hatchback",
  "Van",
  "Otro",
] as const;

export type VehicleTypeLabel = (typeof VEHICLE_TYPE_LABELS)[number];

/**
 * Intenta extraer un valor en COP desde la etiqueta mostrada en UI (p. ej. "$189.000.000").
 * Devuelve null si no hay cifra clara (p. ej. "Consultar").
 */
export const parsePriceCOPFromLabel = (label: string): number | null => {
  const trimmed = label.trim();
  if (!trimmed || /consultar|cotiz|preguntar/i.test(trimmed)) return null;
  const digits = trimmed.replace(/\D/g, "");
  if (!digits) return null;
  const n = Number.parseInt(digits, 10);
  return Number.isFinite(n) ? n : null;
};

/**
 * Clasificación heurística por nombre: el backend aún no expone `vehicleType`.
 */
export const inferVehicleTypeFromName = (name: string): VehicleTypeLabel => {
  const n = name.toLowerCase();
  if (
    /\b(suv|4x4)\b/.test(n) ||
    /camioneta|sportage|tucson|cx[-5]|rav4|cr[- ]v|tracker|outlander|kicks|qashqai|x[- ]trail/i.test(
      n,
    )
  ) {
    return "SUV";
  }
  if (/sedán|sedan|berlina|corolla|civic|altima|sentra|forte|elantra|jetta|mazda\s*3/i.test(n)) {
    return "Sedán";
  }
  if (/pickup|hilux|amarok|ranger|frontier|titan|silverado|f[- ]150|renegade\s*f/i.test(n)) {
    return "Pickup";
  }
  if (/coupé|coupe|\bcupé\b|gt\b|mustang|camaro|370z|86\b|brz/i.test(n)) {
    return "Coupé";
  }
  if (/hatchback|\bhb\b|golf|yaris|swift|sandero\s*stepway|picanto/i.test(n)) {
    return "Hatchback";
  }
  if (/\bvan\b|minivan|transit|hiace|nv200|vito|sprinter|urbana/i.test(n)) {
    return "Van";
  }
  return "Otro";
};

export type VehicleListingFilters = {
  readonly minCOP: number | null;
  readonly maxCOP: number | null;
  readonly vehicleType: VehicleTypeLabel | "todos";
};

export const matchesVehicleFilters = (
  v: VehicleListingDisplay,
  f: VehicleListingFilters,
): boolean => {
  const type = inferVehicleTypeFromName(v.name);
  if (f.vehicleType !== "todos" && type !== f.vehicleType) return false;

  const hasRange = f.minCOP != null || f.maxCOP != null;
  const price = parsePriceCOPFromLabel(v.price);

  if (!hasRange) return true;
  if (price == null) return false;
  if (f.minCOP != null && price < f.minCOP) return false;
  if (f.maxCOP != null && price > f.maxCOP) return false;
  return true;
};
