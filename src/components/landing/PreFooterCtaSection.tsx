"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { PLACEHOLDER_IMAGE_SRC } from "@/lib/placeholder-image";
import { whatsappHref } from "@/lib/site-config";

export const PreFooterCtaSection = () => {
  return (
    <section
      id="contacto"
      className="scroll-mt-28 border-t border-lcdv-gold-2/12"
      aria-labelledby="prefooter-cta-heading"
    >
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={PLACEHOLDER_IMAGE_SRC}
            alt=""
            fill
            className="object-cover opacity-30"
            sizes="100vw"
            loading="lazy"
            aria-hidden
          />
          <div className="absolute inset-0 bg-lcdv-bg/92" aria-hidden />
        </div>
        <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 py-16 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-20 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="max-w-lg"
          >
            <h2
              id="prefooter-cta-heading"
              className="font-display text-3xl font-semibold leading-tight text-lcdv-text sm:text-4xl"
            >
              ¿Listo para un{" "}
              <span className="lcdv-text-gradient">interior de lujo</span>?
            </h2>
            <p className="mt-3 text-sm text-lcdv-text-2 sm:text-base">
              Agenda valoración o consulta inventario. Respondemos por WhatsApp
              con prioridad en Bucaramanga y área metropolitana.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="shrink-0"
          >
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[52px] min-w-[220px] items-center justify-center rounded-full bg-lcdv-gold px-10 py-3.5 text-sm font-bold text-lcdv-text-dark shadow-lcdv-glow transition-transform hover:scale-[1.02] hover:brightness-110"
              aria-label="Escribir por WhatsApp"
            >
              Escribir por WhatsApp
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
