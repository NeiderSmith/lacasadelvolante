import Link from "next/link";
import { brandName } from "@/lib/design-tokens";
import { TERMS_LAST_UPDATED, TERMS_SECTIONS } from "@/lib/terms-content";
import { whatsappE164, whatsappHref } from "@/lib/site-config";

const telHref = `tel:+${whatsappE164}`;

export const TermsContent = () => {
  return (
    <article className="mx-auto max-w-3xl">
      <header className="lcdv-section-intro max-w-none">
        <p className="lcdv-eyebrow">Información legal</p>
        <h1 className="lcdv-heading-section mt-3">Términos y condiciones</h1>
        <p className="lcdv-lead mt-4">
          Condiciones de uso del sitio web de {brandName}. Léelas antes de solicitar cotizaciones,
          servicios o información sobre vehículos.
        </p>
        <p className="mt-4 text-sm text-lcdv-muted">Última actualización: {TERMS_LAST_UPDATED}</p>
      </header>

      <nav
        aria-label="Índice de términos y condiciones"
        className="lcdv-card mt-10 p-6 sm:p-8"
      >
        <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-lcdv-gold">
          Contenido
        </h2>
        <ol className="mt-4 space-y-2 text-sm">
          {TERMS_SECTIONS.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="text-lcdv-text-2 transition-colors hover:text-lcdv-highlight"
              >
                {section.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="mt-10 space-y-10">
        {TERMS_SECTIONS.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className="scroll-mt-32 border-t border-lcdv-gold-2/15 pt-8 first:border-t-0 first:pt-0"
            aria-labelledby={`${section.id}-heading`}
          >
            <h2
              id={`${section.id}-heading`}
              className="font-display text-xl font-semibold text-lcdv-text sm:text-2xl"
            >
              {section.title}
            </h2>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-lcdv-text-2 sm:text-base">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {section.bullets ? (
                <ul className="list-disc space-y-2 pl-5">
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </section>
        ))}
      </div>

      <div className="lcdv-card mt-12 p-6 sm:p-8">
        <h2 className="font-display text-lg font-semibold text-lcdv-text">¿Tienes dudas legales o comerciales?</h2>
        <p className="mt-2 text-sm leading-relaxed text-lcdv-text-2">
          Contáctanos por{" "}
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-lcdv-highlight hover:text-lcdv-light"
          >
            WhatsApp
          </a>{" "}
          o llama al{" "}
          <a href={telHref} className="font-medium text-lcdv-highlight hover:text-lcdv-light">
            +{whatsappE164}
          </a>
          . También puedes volver al{" "}
          <Link href="/#preguntas-frecuentes" className="font-medium text-lcdv-highlight hover:text-lcdv-light">
            apartado de preguntas frecuentes
          </Link>
          .
        </p>
      </div>
    </article>
  );
};
