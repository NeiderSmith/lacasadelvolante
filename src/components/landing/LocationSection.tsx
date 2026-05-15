import {
  businessAddress,
  businessHoursLabel,
  businessHoursValue,
  mapsEmbedUrl,
  metroCoverageCities,
  whatsappE164,
} from "@/lib/site-config";
import { SectionHeader } from "@/components/landing/SectionHeader";

const telHref = `tel:+${whatsappE164}`;

export const LocationSection = () => {
  return (
    <section
      id="ubicacion"
      className="lcdv-section lcdv-section-textured scroll-mt-28 border-t border-lcdv-gold-2/12"
      aria-labelledby="ubicacion-heading"
    >
      <div className="lcdv-container">
        <SectionHeader
          eyebrow="Visítanos"
          title="¿Dónde estamos ubicados?"
          titleId="ubicacion-heading"
          description={businessAddress.description}
          variant="on-textured"
          className="max-w-3xl"
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,22rem)_1fr] lg:items-stretch lg:gap-10">
          <div className="lcdv-card flex flex-col gap-6 p-6 sm:p-8">
            <div>
              <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-lcdv-gold">
                Dirección
              </h3>
              <p className="mt-2 font-display text-xl font-semibold text-lcdv-text">
                {businessAddress.streetAddress}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-lcdv-text-2">
                {businessAddress.addressLocality}, {businessAddress.addressRegion} —{" "}
                {businessAddress.addressCountry === "CO" ? "Colombia" : businessAddress.addressCountry}
              </p>
            </div>

            <div>
              <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-lcdv-gold">
                Área de cobertura
              </h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {metroCoverageCities.map((city) => (
                  <li
                    key={city}
                    className="rounded-full border border-lcdv-gold-2/30 bg-lcdv-bronze/15 px-3 py-1 text-xs font-medium text-lcdv-text-2"
                  >
                    {city}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-lcdv-gold">
                Horario
              </h3>
              <p className="mt-2 text-sm font-medium text-lcdv-text">{businessHoursLabel}</p>
              <p className="text-sm text-lcdv-text-2">{businessHoursValue}</p>
            </div>

            <p className="text-xs leading-relaxed text-lcdv-muted">
              También puedes llamar al{" "}
              <a href={telHref} className="font-medium text-lcdv-highlight hover:text-lcdv-light">
                +{whatsappE164}
              </a>
              . Escríbenos antes de tu visita para confirmar disponibilidad.
            </p>
          </div>

          <div className="lcdv-card overflow-hidden p-1 sm:p-1.5">
            <iframe
              title="Mapa de ubicación — La Casa del Volante, Bucaramanga"
              src={mapsEmbedUrl}
              className="h-[min(320px,55vh)] w-full rounded-[0.65rem] border-0 bg-lcdv-bg/50 lg:h-full lg:min-h-[420px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
};
