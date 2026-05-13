"use client";

import { brandName } from "@/lib/design-tokens";
import { instagramHref, whatsappHref } from "@/lib/site-config";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";

const navLinks = [
  { href: "#servicios", label: "Servicios" },
  { href: "#galeria", label: "Galería" },
  { href: "#vehiculos", label: "Vehículos" },
  { href: "#testimonios", label: "Testimonios" },
  { href: "#contacto", label: "Contacto" },
];

export const Navbar = () => {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 40);
  });

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "lcdv-glass-nav border-b border-lcdv-gold-2/25" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:h-[4.5rem] sm:px-6 lg:px-8">
        <a
          href="#inicio"
          className="font-display text-lg font-semibold tracking-tight text-lcdv-text sm:text-xl"
          aria-label={`${brandName}, ir al inicio`}
        >
          <span className="lcdv-text-gradient">{brandName}</span>
        </a>

        <nav
          className="hidden items-center gap-8 md:flex"
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

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={instagramHref}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-full border border-lcdv-gold-2/40 px-3 py-1.5 text-xs font-semibold text-lcdv-text transition-colors hover:border-lcdv-highlight hover:text-lcdv-light sm:inline-flex sm:px-4 sm:text-sm"
            aria-label="Instagram de La Casa del Volante"
          >
            Instagram
          </a>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-lcdv-gold px-4 py-2 text-xs font-semibold text-lcdv-text-dark shadow-lcdv-glow transition-transform hover:scale-[1.02] hover:brightness-110 sm:text-sm"
            aria-label="Contactar por WhatsApp"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </motion.header>
  );
};
