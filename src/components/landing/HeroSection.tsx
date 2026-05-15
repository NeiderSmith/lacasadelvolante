"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { instagramHref, tiktokHref, whatsappHref } from "@/lib/site-config";
import { LANDING_SERVICES } from "@/lib/landing-services";
import { TikTokGlyph } from "@/components/landing/TikTokGlyph";
import { ServiceIcon } from "@/components/landing/ServiceIcon";

const HERO_PORTRAIT_IMAGES = ["/Paez.jpg", "/Paez2.jpg", "/Negocio2.jpg"] as const;
const PORTRAIT_CROSSFADE_INTERVAL_MS = 5000;
const PORTRAIT_FADE_DURATION_S = 1.1;

const HeroPortraitCrossfade = () => {
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const id = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % HERO_PORTRAIT_IMAGES.length);
    }, PORTRAIT_CROSSFADE_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [prefersReducedMotion]);

  return (
    <figure
      className="relative aspect-square w-full max-w-[min(100%,400px)] overflow-hidden rounded-lg border border-lcdv-highlight/35 bg-black/25 shadow-[0_24px_60px_rgba(0,0,0,0.55)] ring-1 ring-white/10 lg:max-w-[400px]"
      aria-label="La Casa del Volante — Bucaramanga"
    >
      {HERO_PORTRAIT_IMAGES.map((src, index) => (
        <motion.div
          key={src}
          animate={{ opacity: activeIndex === index ? 1 : 0 }}
          transition={{ duration: PORTRAIT_FADE_DURATION_S, ease: "easeInOut" }}
          className="absolute inset-0"
          aria-hidden={activeIndex !== index}
        >
          <Image
            src={src}
            alt=""
            fill
            priority={index === 0}
            sizes="(max-width: 1024px) 90vw, 420px"
            className="object-contain object-center"
          />
        </motion.div>
      ))}
    </figure>
  );
};

const HERO_TRUST_POINTS = [
  "Materiales premium",
  "Garantia del servicio",
  "Cotización por WhatsApp",
] as const;

const socialIconClass =
  "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-sm transition hover:border-lcdv-highlight hover:bg-lcdv-highlight/20 hover:text-lcdv-highlight";

export const HeroSection = () => {
  return (
    <section
      id="inicio"
      className="relative flex min-h-[100svh] flex-col scroll-mt-28 overflow-hidden"
      aria-labelledby="hero-heading"
    >
      <div className="absolute inset-0">
        <Image
          src="/fondo.png"
          alt="Taller e interiores automotrices — La Casa del Volante, Bucaramanga"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center sm:object-[center_35%]"
        />
        <div className="absolute inset-0 bg-black/54" aria-hidden />
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/35 to-black/20 lg:via-black/30 lg:to-transparent"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/25"
          aria-hidden
        />
      </div>

      <div className="relative z-10 flex min-h-0 flex-1 flex-col px-4 pb-0 pt-40 sm:px-6 sm:pt-44 lg:px-8 lg:pt-32">
        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center py-8 lg:py-12">
          <motion.div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(280px,380px)] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_minmax(300px,420px)] xl:gap-16">
            <div className="max-w-3xl">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="font-sans text-[11px] font-bold uppercase tracking-[0.28em] text-lcdv-highlight drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)] sm:text-xs"
            >
              Bienvenido a La Casa del Volante
            </motion.p>

            <motion.h1
              id="hero-heading"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06, duration: 0.5 }}
              className="mt-4 font-sans text-3xl font-bold uppercase leading-[1.12] tracking-tight text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.85)] sm:text-4xl sm:leading-[1.1] lg:text-5xl lg:leading-[1.08]"
            >
              Tapicería premium que transforma cada detalle de tu vehículo
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14, duration: 0.5 }}
              className="mt-6 max-w-xl font-sans text-sm leading-relaxed text-white/95 drop-shadow-[0_1px_10px_rgba(0,0,0,0.85)] sm:text-base lg:text-lg"
            >
              Restauración de interiores, tapizado de volantes y asientos, y compra venta de
              vehículos.
              <br />
              Atención en Bucaramanga, Floridablanca, Girón y Piedecuesta.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.45 }}
              className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
            >
              <a
                href="#servicios"
                className="lcdv-btn-primary min-w-[200px]"
                aria-label="Ver servicios detallados"
              >
                Conocer más
              </a>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="lcdv-btn-ghost-light"
                aria-label="Solicitar cotización por WhatsApp"
              >
                Cotizar ahora
              </a>
            </motion.div>
            <motion.nav
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.45 }}
              className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center"
              aria-label="Síguenos en redes sociales"
            >
              <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-white/75 drop-shadow-[0_1px_6px_rgba(0,0,0,0.85)]">
                Síguenos
              </span>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={instagramHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={socialIconClass}
                  aria-label="Instagram"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm6-1.25a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
                  </svg>
                </a>
                <a
                  href={tiktokHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={socialIconClass}
                  aria-label="TikTok"
                >
                  <TikTokGlyph className="h-5 w-5" />
                </a>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={socialIconClass}
                  aria-label="WhatsApp"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.883 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </a>
              </div>
            </motion.nav>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12, duration: 0.55 }}
              className="relative hidden w-full max-w-none justify-self-end lg:mx-0 lg:block lg:max-w-[400px]"
            >
              <HeroPortraitCrossfade />
            </motion.div>
          </motion.div>
        </div>

        <div className="mt-auto w-full border-t border-black/20 bg-lcdv-highlight">
          <nav
            className="mx-auto grid max-w-7xl grid-cols-2 gap-y-6 px-4 py-6 sm:grid-cols-3 sm:px-6 lg:grid-cols-6 lg:gap-4 lg:px-8"
            aria-label="Servicios destacados"
          >
            {LANDING_SERVICES.map((s, i) => (
              <motion.a
                key={s.id}
                href={`#servicio-${s.id}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + i * 0.04, duration: 0.35 }}
                className="group flex flex-col items-center gap-2 text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lcdv-text-dark"
              >
                <ServiceIcon serviceId={s.id} className="h-7 w-7 text-lcdv-text-dark" />
                <span className="font-sans text-xs font-bold uppercase tracking-wide text-lcdv-text-dark sm:text-sm">
                  {s.barLabel}
                </span>
              </motion.a>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
};
