import { brandName } from "@/lib/design-tokens";
import {
  businessAddress,
  instagramHref,
  siteUrl,
  tiktokHref,
  whatsappE164,
  whatsappHref,
} from "@/lib/site-config";

const quickLinks = [
  { href: "#inicio", label: "Inicio" },
  { href: "#servicios", label: "Servicios" },
  { href: "#galeria", label: "Galería" },
  { href: "#vehiculos", label: "Vehículos" },
  { href: "#contacto", label: "Contacto" },
];

export const Footer = () => {
  return (
    <footer
      className="border-t border-lcdv-gold-2/20 bg-lcdv-bg pb-12 pt-16"
      role="contentinfo"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <span className="inline-block font-display text-xl font-semibold lcdv-text-gradient">
              {brandName}
            </span>
            <p className="mt-3 text-sm text-lcdv-text-2">
              Tapicería automotriz premium y compra venta de vehículos en
              Bucaramanga, Santander. Servicio en Floridablanca, Girón y
              Piedecuesta.
            </p>
          </div>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-lcdv-muted">
              Enlaces rápidos
            </h2>
            <ul className="mt-4 space-y-2">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-sm text-lcdv-text-2 transition-colors hover:text-lcdv-text"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-lcdv-muted">
              Contacto
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-lcdv-text-2">
              <li>
                <a
                  href={whatsappHref}
                  className="font-medium text-lcdv-highlight hover:text-lcdv-light"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp +{whatsappE164}
                </a>
              </li>
              <li>
                <a
                  href={instagramHref}
                  className="hover:text-lcdv-text"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href={tiktokHref}
                  className="hover:text-lcdv-text"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  TikTok
                </a>
              </li>
              <li>
                <span className="block text-lcdv-muted">
                  Ubicación: {businessAddress.addressLocality},{" "}
                  {businessAddress.addressRegion}, {businessAddress.addressCountry}
                </span>
                <span className="mt-1 block text-xs leading-relaxed">
                  {businessAddress.description}
                </span>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-lcdv-muted">
              SEO local
            </h2>
            <p className="mt-4 text-xs leading-relaxed text-lcdv-muted">
              Tapicería automotriz Bucaramanga · tapicería de carros · restauración
              de interiores de vehículos · tapizado de volantes · tapizado de
              asientos · restauración de tableros · compra y venta de vehículos
              Bucaramanga · venta de carros usados · Santander.
            </p>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-lcdv-gold-2/15 pt-8 text-xs text-lcdv-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {brandName}. Todos los derechos reservados.
          </p>
          <p className="break-all">
            <a href={siteUrl} className="hover:text-lcdv-text-2">
              {siteUrl.replace(/^https:\/\//, "")}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};
