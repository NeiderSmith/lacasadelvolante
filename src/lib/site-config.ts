/**
 * Datos de negocio y contacto. Ajusta en Amplify / .env sin tocar design-style.json.
 */
const trim = (v: string | undefined) => (v ?? "").trim();

export const siteUrl =
  trim(process.env.NEXT_PUBLIC_SITE_URL) || "https://lacasadelvolante.com";

/** E.164 sin +: ej. 573001234567 */
export const whatsappE164 =
  trim(process.env.NEXT_PUBLIC_WHATSAPP_E164) || "573001234567";

export const whatsAppQuoteMessage = encodeURIComponent(
  "Hola La Casa del Volante, quiero información o una cotización. Vengo desde la web.",
);

export const whatsAppVehicleBuyMessage = encodeURIComponent(
  "Hola La Casa del Volante, vengo desde la web y quiero información para comprar un vehículo.",
);

export const whatsAppVehicleSellMessage = encodeURIComponent(
  "Hola La Casa del Volante, vengo desde la web: quiero vender mi vehículo.",
);

export const whatsappHref = `https://wa.me/${whatsappE164}?text=${whatsAppQuoteMessage}`;

export const whatsappVehicleBuyHref = `https://wa.me/${whatsappE164}?text=${whatsAppVehicleBuyMessage}`;

export const whatsappVehicleSellHref = `https://wa.me/${whatsappE164}?text=${whatsAppVehicleSellMessage}`;

export const instagramHandle = trim(process.env.NEXT_PUBLIC_INSTAGRAM) || "lacasadelvolante";

export const instagramHref = `https://instagram.com/${instagramHandle.replace(/^@/, "")}`;

/** URL del perfil de TikTok (sobrescribible por entorno). */
export const tiktokHref =
  trim(process.env.NEXT_PUBLIC_TIKTOK_URL) ||
  "https://www.tiktok.com/@lacasadelvolantebga";

export const businessAddress = {
  streetAddress: "Carrera 25 # 20-61",
  addressLocality: "Bucaramanga",
  addressRegion: "Santander",
  addressCountry: "CO",
  description:
    "Atención en Bucaramanga y área metropolitana: Floridablanca, Girón y Piedecuesta.",
} as const;

/** Línea de dirección visible (sobrescribible por entorno). */
export const businessAddressLine =
  trim(process.env.NEXT_PUBLIC_BUSINESS_ADDRESS) ||
  "Carrera 25 # 20-61, Bucaramanga, Santander, Colombia";

export const metroCoverageCities = [
  "Bucaramanga",
  "Floridablanca",
  "Girón",
  "Piedecuesta",
] as const;

export const businessHoursLabel = "Lunes a sábado";
export const businessHoursValue = "8:00 a. m. – 6:00 p. m.";

export const mapsDirectionsUrl =
  trim(process.env.NEXT_PUBLIC_GOOGLE_MAPS_DIRECTIONS_URL) ||
  "https://www.google.com/maps/dir/?api=1&destination=Carrera+25+%2320-61%2C+Bucaramanga%2C+Santander%2C+Colombia";

/** URL del iframe de Google Maps (Compartir → Insertar un mapa). */
export const mapsEmbedUrl =
  trim(process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL) ||
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d989.7439806033923!2d-73.12159813031954!3d7.128781499554698!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e681564e2b30d85%3A0x580463b68223e42!2sCra.%2025%20%23%2020%2061%2C%20Bucaramanga%2C%20Santander!5e0!3m2!1ses!2sco!4v1778876162534!5m2!1ses!2sco";
