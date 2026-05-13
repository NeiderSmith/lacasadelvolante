"use client";

import { brandName } from "@/lib/design-tokens";
import { instagramHref, whatsappE164, whatsappHref } from "@/lib/site-config";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";

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
    setScrolled(y > 24);
  });

  return (
    <motion.header
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "lcdv-glass-nav border-b border-lcdv-gold-2/20" : "bg-transparent"
      }`}
    >
      <div className="relative mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6 lg:px-8">
        <a
          href="#inicio"
          className="shrink-0 font-display text-base font-semibold tracking-tight text-lcdv-text sm:text-lg"
          aria-label={`${brandName}, ir al inicio`}
        >
          <span className="lcdv-text-gradient">{brandName}</span>
        </a>

        <nav
          className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-7 lg:flex"
          aria-label="Navegación principal"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-lcdv-text-2 transition-colors hover:text-lcdv-text"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <a
            href={telHref}
            className="hidden text-sm font-medium text-lcdv-text-2 transition-colors hover:text-lcdv-text md:inline"
            aria-label={`Llamar al +${whatsappE164}`}
          >
            +{whatsappE164}
          </a>
          <a
            href={instagramHref}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-full border border-lcdv-gold-2/35 px-3 py-1.5 text-xs font-semibold text-lcdv-text-2 transition-colors hover:border-lcdv-highlight hover:text-lcdv-text xl:inline-flex"
            aria-label="Instagram"
          >
            Instagram
          </a>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-lcdv-gold px-4 py-2 text-xs font-semibold text-lcdv-text-dark shadow-lcdv-glow transition-transform hover:scale-[1.02] hover:brightness-110 sm:text-sm"
            aria-label="Solicitar cotización por WhatsApp"
          >
            Solicitar cotización
          </a>
        </div>
      </div>

      <nav
        className="flex justify-center gap-4 overflow-x-auto border-t border-lcdv-gold-2/10 px-4 py-2 lg:hidden"
        aria-label="Navegación móvil"
      >
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="whitespace-nowrap text-xs font-medium text-lcdv-text-2"
          >
            {link.label}
          </a>
        ))}
      </nav>
    </motion.header>
  );
};
