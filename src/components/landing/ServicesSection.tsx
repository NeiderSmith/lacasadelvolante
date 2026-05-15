"use client";

import { motion, useReducedMotion } from "framer-motion";
import { LANDING_SERVICES } from "@/lib/landing-services";
import { whatsappHref } from "@/lib/site-config";
import { SectionHeader } from "@/components/landing/SectionHeader";
import { ServiceIcon } from "@/components/landing/ServiceIcon";

export const ServicesSection = () => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="servicios"
      className="lcdv-section lcdv-section-textured scroll-mt-28 border-t border-lcdv-gold-2/12"
      aria-labelledby="servicios-heading"
    >
      <motion.div
        className="lcdv-container"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-48px" }}
        transition={{ duration: 0.5 }}
      >
        <SectionHeader
          eyebrow="Servicios especializados"
          title="Cada detalle de tu interior, con acabado premium"
          titleId="servicios-heading"
          description="Volantes, tableros, palancas, asientos, interiores completos y compra/venta de vehículos. Trabajamos con materiales de alta gama y procesos transparentes en Bucaramanga y área metropolitana."
          variant="on-textured"
          className="max-w-3xl"
        />

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {LANDING_SERVICES.map((service, index) => (
            <motion.li
              key={service.id}
              id={`servicio-${service.id}`}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-32px" }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="scroll-mt-32"
            >
              <article className="lcdv-card group flex h-full flex-col p-6 transition duration-300 hover:border-lcdv-highlight/55 hover:shadow-lcdv-glow">
                <motion.div
                  className="flex h-12 w-12 items-center justify-center rounded-xl border border-lcdv-highlight/30 bg-lcdv-highlight/10"
                  whileHover={prefersReducedMotion ? undefined : { scale: 1.04 }}
                >
                  <ServiceIcon serviceId={service.id} className="h-7 w-7" />
                </motion.div>
                <h3 className="mt-5 font-display text-xl font-semibold text-lcdv-text">
                  {service.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-lcdv-text-2">
                  {service.desc}
                </p>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lcdv-link-arrow mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-lcdv-highlight"
                  aria-label={`Cotizar ${service.title} por WhatsApp`}
                >
                  Cotizar este servicio
                  <span aria-hidden className="transition group-hover:translate-x-0.5">
                    →
                  </span>
                </a>
              </article>
            </motion.li>
          ))}
        </ul>

        <div className="lcdv-textured-panel mt-12 flex flex-col items-center gap-4 px-6 py-8 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="max-w-xl">
            <p className="font-sans text-sm font-semibold text-lcdv-text">
              ¿No sabes por dónde empezar?
            </p>
            <p className="mt-1 text-sm text-lcdv-text-2">
              Escríbenos por WhatsApp con fotos de tu vehículo y te orientamos con la mejor
              opción.
            </p>
          </div>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="lcdv-btn-primary shrink-0"
            aria-label="Solicitar asesoría por WhatsApp"
          >
            Asesoría gratuita
          </a>
        </div>
      </motion.div>
    </section>
  );
};
