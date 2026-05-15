/** Marcas frecuentes en el mercado de vehículos usados en Latinoamérica. */
export const LATIN_AMERICA_VEHICLE_BRANDS = [
  { id: "toyota", name: "Toyota" },
  { id: "chevrolet", name: "Chevrolet" },
  { id: "renault", name: "Renault" },
  { id: "nissan", name: "Nissan" },
  { id: "mazda", name: "Mazda" },
  { id: "kia", name: "Kia" },
  { id: "hyundai", name: "Hyundai" },
  { id: "ford", name: "Ford" },
  { id: "volkswagen", name: "Volkswagen" },
  { id: "fiat", name: "Fiat" },
  { id: "peugeot", name: "Peugeot" },
  { id: "citroen", name: "Citroën" },
  { id: "mitsubishi", name: "Mitsubishi" },
  { id: "honda", name: "Honda" },
  { id: "suzuki", name: "Suzuki" },
  { id: "jeep", name: "Jeep" },
  { id: "bmw", name: "BMW" },
  { id: "mercedes-benz", name: "Mercedes-Benz" },
  { id: "audi", name: "Audi" },
  { id: "volvo", name: "Volvo" },
  { id: "subaru", name: "Subaru" },
  { id: "chery", name: "Chery" },
  { id: "jac", name: "JAC" },
  { id: "ram", name: "RAM" },
  { id: "dodge", name: "Dodge" },
] as const;

export type LatinAmericaVehicleBrand = (typeof LATIN_AMERICA_VEHICLE_BRANDS)[number];

export const getVehicleBrandLogoSrc = (id: LatinAmericaVehicleBrand["id"]): string =>
  `/brands/${id}.svg`;
