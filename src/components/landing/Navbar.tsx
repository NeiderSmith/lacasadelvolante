"use client";

import { brandName } from "@/lib/design-tokens";
import {
  businessAddress,
  instagramHref,
  tiktokHref,
  whatsappE164,
  whatsappHref,
} from "@/lib/site-config";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { TikTokGlyph } from "@/components/landing/TikTokGlyph";

const navLinks = [
  { href: "#inicio", label: "Inicio" },
  { href: "#servicios", label: "Servicios" },
  { href: "#galeria", label: "Galería" },
  { href: "#vehiculos", label: "Vehículos" },
  { href: "#contacto", label: "Contacto" },
];

const telHref = `tel:+${whatsappE164}`;

export const Navbar = () => {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 48);
  });

  return (
    <motion.header
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "shadow-lg shadow-black/40" : ""
      }`}
    >
      <div
        className={`hidden overflow-hidden transition-all duration-300 sm:block ${
          scrolled ? "max-h-0 opacity-0" : "max-h-16 opacity-100"
        }`}
        aria-hidden={scrolled}
      >
        <div className="flex items-center justify-between gap-4 bg-lcdv-highlight px-4 py-2 text-lcdv-text-dark sm:px-6 lg:px-8">
          <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1 font-sans text-xs font-medium sm:text-sm">
            <a href={telHref} className="shrink-0 hover:underline" aria-label={`Llamar al +${whatsappE164}`}>
              +{whatsappE164}
            </a>
            <span className="hidden text-lcdv-text-dark/50 sm:inline" aria-hidden>
              |
            </span>
            <span className="line-clamp-1 text-lcdv-text-dark/90">{businessAddress.description}</span>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <a
              href={instagramHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded border border-lcdv-text-dark/25 bg-black/5 text-lcdv-text-dark transition hover:bg-black/15"
              aria-label="Instagram"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm6-1.25a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
              </svg>
            </a>
            <a
              href={tiktokHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded border border-lcdv-text-dark/25 bg-black/5 text-lcdv-text-dark transition hover:bg-black/15"
              aria-label="TikTok"
            >
              <TikTokGlyph className="h-4 w-4" />
            </a>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded border border-lcdv-text-dark/25 bg-black/5 text-lcdv-text-dark transition hover:bg-black/15"
              aria-label="WhatsApp"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.883 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div
        className={`border-b transition-colors duration-300 ${
          scrolled
            ? "lcdv-glass-nav border-lcdv-gold-2/25 bg-lcdv-bg/90"
            : "border-transparent bg-black"
        }`}
      >
        <div className="relative mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6 lg:px-8">
          <a
            href="#inicio"
            className="shrink-0 font-display text-base font-semibold tracking-tight sm:text-lg"
            aria-label={`${brandName}, ir al inicio`}
          >
            {scrolled ? (
              <span className="lcdv-text-gradient">{brandName}</span>
            ) : (
              <>
                <span className="text-white">La Casa del </span>
                <span className="text-lcdv-highlight">Volante</span>
              </>
            )}
          </a>

          <nav
            className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-7 lg:flex"
            aria-label="Navegación principal"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  scrolled ? "text-lcdv-text-2 hover:text-lcdv-text" : "text-white/85 hover:text-white"
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center bg-lcdv-highlight px-4 py-2 font-sans text-xs font-bold uppercase tracking-wide text-lcdv-text-dark transition hover:brightness-110 sm:px-5 sm:text-sm"
              aria-label="Cotizar ahora por WhatsApp"
            >
              Cotizar ahora
            </a>
          </div>
        </div>

        <nav
          className={`flex justify-center gap-4 overflow-x-auto border-t px-4 py-2 lg:hidden ${
            scrolled ? "border-lcdv-gold-2/15" : "border-white/10"
          }`}
          aria-label="Navegación móvil"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`whitespace-nowrap text-xs font-medium ${
                scrolled ? "text-lcdv-text-2" : "text-white/80"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </motion.header>
  );
};
