import type { VehicleListingDisplay } from "@/lib/vehicle-types";



/** Datos de ejemplo cuando no hay `NEXT_PUBLIC_AMPLIFY_OUTPUTS` (desarrollo local). */

export const featuredVehicleFallback: readonly VehicleListingDisplay[] = [

  {

    id: "fb-suv",

    name: "SUV ejecutiva AWD",

    year: 2022,

    km: "38.000 km",

    engine: "3.0 T",

    power: "340 HP",

    trans: "Auto 8V",

    price: "$189.000.000",

    badge: "Destacado",

    vehicleBrand: "BMW",

    alt: "Vehículo en venta — SUV Bucaramanga (placeholder)",

    imageUrl: null,

  },

  {

    id: "fb-berlina",

    name: "Berlina deportiva V6",

    year: 2021,

    km: "52.000 km",

    engine: "3.0 V6",

    power: "367 HP",

    trans: "Auto 9G",

    price: "$165.000.000",

    badge: null,

    vehicleBrand: "Mercedes-Benz",

    alt: "Vehículo en venta — berlina Santander (placeholder)",

    imageUrl: null,

  },

  {

    id: "fb-coupe",

    name: "Coupé gran turismo",

    year: 2020,

    km: "44.500 km",

    engine: "4.0 V8",

    power: "469 HP",

    trans: "Auto 7V",

    price: "$142.000.000",

    badge: "Nuevo ingreso",

    vehicleBrand: "Toyota",

    alt: "Vehículo en venta — coupé Floridablanca (placeholder)",

    imageUrl: null,

  },

];


