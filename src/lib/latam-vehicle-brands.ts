/**
 * Marcas de pasajeros frecuentes en Latinoamérica (selector en admin y filtros en web).
 * Orden alfabético en UI; el array está en orden de uso comercial aproximado.
 */
export const LATAM_VEHICLE_BRANDS = [
  "Acura",
  "Audi",
  "BAIC",
  "BMW",
  "BYD",
  "Changan",
  "Chery",
  "Chevrolet",
  "Chrysler",
  "Citroën",
  "Dodge",
  "Fiat",
  "Ford",
  "Geely",
  "Great Wall",
  "Haval",
  "Honda",
  "Hyundai",
  "Isuzu",
  "JAC",
  "Jeep",
  "Kia",
  "Land Rover",
  "Lexus",
  "Mazda",
  "Mercedes-Benz",
  "MINI",
  "Mitsubishi",
  "Nissan",
  "Peugeot",
  "Porsche",
  "RAM",
  "Renault",
  "SEAT",
  "Skoda",
  "Subaru",
  "Suzuki",
  "Tesla",
  "Toyota",
  "Volkswagen",
  "Volvo",
] as const;

export type LatamVehicleBrand = (typeof LATAM_VEHICLE_BRANDS)[number];

export const isLatamVehicleBrand = (value: string): value is LatamVehicleBrand =>
  (LATAM_VEHICLE_BRANDS as readonly string[]).includes(value);

/** Opciones para `<select>`: vacío + marcas + “Otra”. */
export const latamVehicleBrandSelectOptions: readonly {
  readonly value: string;
  readonly label: string;
}[] = [
  { value: "", label: "— Sin marca —" },
  ...LATAM_VEHICLE_BRANDS.map((b) => ({ value: b, label: b })),
  { value: "__custom__", label: "Otra (escribir)" },
];
