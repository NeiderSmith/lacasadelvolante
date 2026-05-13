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

export const whatsappHref = `https://wa.me/${whatsappE164}?text=${whatsAppQuoteMessage}`;

export const instagramHandle = trim(process.env.NEXT_PUBLIC_INSTAGRAM) || "lacasadelvolante";

export const instagramHref = `https://instagram.com/${instagramHandle.replace(/^@/, "")}`;

export const businessAddress = {
  streetAddress: "Bucaramanga",
  addressLocality: "Bucaramanga",
  addressRegion: "Santander",
  addressCountry: "CO",
  description:
    "Atención en Bucaramanga y área metropolitana: Floridablanca, Girón y Piedecuesta.",
} as const;
