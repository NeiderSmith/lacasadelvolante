import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { brandName, rootCssVariablesString, themeColorHex } from "@/lib/design-tokens";
import { buildLocalBusinessJsonLd } from "@/lib/json-ld";
import { siteUrl } from "@/lib/site-config";

const displayFont = Cormorant_Garamond({
  variable: "--font-lcdv-display",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const sansFont = Inter({
  variable: "--font-lcdv-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  adjustFontFallback: true,
});

const keywords = [
  "tapicería automotriz Bucaramanga",
  "tapicería de carros Bucaramanga",
  "restauración de interiores de vehículos Bucaramanga",
  "tapizado de volantes Bucaramanga",
  "tapicería premium automotriz Santander",
  "compra y venta de vehículos Bucaramanga",
  "venta de carros usados Bucaramanga",
  "restauración de vehículos Bucaramanga",
  "tapizado de asientos Bucaramanga",
  "restauración de tableros Bucaramanga",
  "Floridablanca tapicería",
  "Girón tapicería automotriz",
  "Piedecuesta restauración interiores",
  "La Casa del Volante",
];

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${brandName} | Tapicería premium y vehículos en Bucaramanga`,
    template: `%s | ${brandName}`,
  },
  description:
    "Tapicería automotriz premium en Bucaramanga: tapizado de volantes y asientos, restauración de tableros e interiores, y compra venta de vehículos en Santander. Atendemos Floridablanca, Girón y Piedecuesta.",
  keywords,
  authors: [{ name: brandName }],
  creator: brandName,
  publisher: brandName,
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: siteUrl,
    siteName: brandName,
    title: `${brandName} | Tapicería premium y vehículos Bucaramanga`,
    description:
      "Especialistas en tapicería de carros, restauración de interiores y venta de vehículos usados premium en Bucaramanga y área metropolitana.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${brandName} | Tapicería y vehículos Bucaramanga`,
    description:
      "Tapicería automotriz premium y compra venta de vehículos en Santander. Cotiza por WhatsApp.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  category: "automotive",
};

export const viewport = {
  themeColor: themeColorHex,
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = buildLocalBusinessJsonLd();

  return (
    <html
      lang="es-CO"
      className={`${displayFont.variable} ${sansFont.variable} h-full scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: rootCssVariablesString(),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd }}
        />
      </head>
      <body className="font-sans min-h-dvh flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
