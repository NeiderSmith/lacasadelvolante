import { brandName } from "@/lib/design-tokens";
import {
  businessAddress,
  instagramHref,
  siteUrl,
  tiktokHref,
  whatsappE164,
} from "@/lib/site-config";

export const buildLocalBusinessJsonLd = (): string => {
  const payload = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "AutomotiveBusiness"],
    name: brandName,
    description:
      "Tapicería automotriz premium, restauración de interiores y compra venta de vehículos en Bucaramanga, Santander. Atención en Floridablanca, Girón y Piedecuesta.",
    url: siteUrl,
    telephone: `+${whatsappE164}`,
    image: `${siteUrl.replace(/\/$/, "")}/opengraph-image`,
    priceRange: "$$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: businessAddress.addressLocality,
      addressRegion: businessAddress.addressRegion,
      addressCountry: businessAddress.addressCountry,
    },
    areaServed: [
      { "@type": "City", name: "Bucaramanga" },
      { "@type": "City", name: "Floridablanca" },
      { "@type": "City", name: "Girón" },
      { "@type": "City", name: "Piedecuesta" },
      { "@type": "AdministrativeArea", name: "Santander" },
    ],
    sameAs: [instagramHref, tiktokHref],
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "08:00",
      closes: "18:00",
    },
    makesOffer: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Tapicería y restauración de interiores automotrices",
          areaServed: "Bucaramanga y área metropolitana",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Compra y venta de vehículos",
          areaServed: "Santander",
        },
      },
    ],
  };

  return JSON.stringify(payload);
};
