/** Enlaces internos que funcionan desde cualquier ruta del sitio. */
export const resolveSiteHref = (href: string) => {
  if (href.startsWith("/")) return href;
  if (href.startsWith("#")) return `/${href}`;
  return href;
};

export const homeSectionLinks = [
  { href: "#inicio", label: "Inicio" },
  { href: "#servicios", label: "Servicios" },
  { href: "#galeria", label: "Galería" },
  { href: "#vehiculos", label: "Vehículos" },
  { href: "#ubicacion", label: "Ubicación" },
  { href: "#preguntas-frecuentes", label: "FAQ" },
] as const;

export const legalLinks = [{ href: "/terminos", label: "Términos y condiciones" }] as const;
