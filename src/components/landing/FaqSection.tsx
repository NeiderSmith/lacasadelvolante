import { FAQ_ITEMS } from "@/lib/faq-content";
import { whatsappHref } from "@/lib/site-config";
import { SectionHeader } from "@/components/landing/SectionHeader";
import { FaqAccordion } from "@/components/landing/FaqAccordion";

export const FaqSection = () => {
  return (
    <section
      id="preguntas-frecuentes"
      className="lcdv-section lcdv-section-textured scroll-mt-28 border-t border-lcdv-gold-2/12"
      aria-labelledby="faq-heading"
    >
      <div className="lcdv-container">
        <SectionHeader
          eyebrow="Resolvemos tus dudas"
          title="Preguntas frecuentes"
          titleId="faq-heading"
          description="Información clara sobre cotizaciones, tiempos, materiales, vehículos y atención en Bucaramanga y área metropolitana."
          variant="on-textured"
          className="max-w-3xl"
        />

        <div className="mt-10 max-w-3xl">
          <FaqAccordion items={FAQ_ITEMS} />
        </div>

        <div className="lcdv-card mt-10 flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="font-display text-lg font-semibold text-lcdv-text">
              ¿No encontraste tu respuesta?
            </p>
            <p className="mt-1 text-sm text-lcdv-text-2">
              Escríbenos por WhatsApp y te orientamos con gusto.
            </p>
          </div>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="lcdv-btn-primary shrink-0"
            aria-label="Hacer una pregunta por WhatsApp"
          >
            Preguntar por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
};
