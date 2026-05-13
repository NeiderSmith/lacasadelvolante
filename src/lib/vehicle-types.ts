export type VehicleListingDisplay = {

  readonly id: string;

  name: string;

  year: number | null;

  km: string;

  engine: string;

  power: string;

  trans: string;

  price: string;

  badge: string | null;

  alt: string;

  /** URL firmada o pública; null → placeholder en UI */

  imageUrl: string | null;

};


