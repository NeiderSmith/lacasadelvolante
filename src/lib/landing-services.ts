export type LandingService = {
  readonly id: string;
  /** Texto en la franja amarilla del hero */
  readonly barLabel: string;
  readonly title: string;
  readonly desc: string;
};

export const LANDING_SERVICES: readonly LandingService[] = [
  {
    id: "volantes",
    barLabel: "Volantes",
    title: "Tapizado de volantes",
    desc: "Deportivo, madera noble y costuras manuales. Tapizado de volantes Bucaramanga.",
  },
  {
    id: "tableros",
    barLabel: "Tableros",
    title: "Restauración de tableros",
    desc: "Cuero, alcántara y detalles metálicos. Restauración de tableros Santander.",
  },
  {
    id: "asientos",
    barLabel: "Asientos",
    title: "Asientos y cielo raso",
    desc: "Costuras diamante, tapizado de asientos y cielos personalizados.",
  },
  {
    id: "interiores",
    barLabel: "Interiores",
    title: "Interiores a medida",
    desc: "Consolas, palancas e identidad exclusiva para tu vehículo.",
  },
  {
    id: "venta-vehiculos",
    barLabel: "Vehículos",
    title: "Compra y venta de vehículos",
    desc: "Inventario curado y asesoría en venta de carros usados premium.",
  },
  {
    id: "tasacion",
    barLabel: "Tasación",
    title: "Peritaje y tasación",
    desc: "Evaluación transparente para compra o venta en el área metropolitana.",
  },
] as const;
