import Image from "next/image";
import {
  LATIN_AMERICA_VEHICLE_BRANDS,
  getVehicleBrandLogoSrc,
} from "@/lib/latin-america-vehicle-brands";

const BrandLogo = ({
  id,
  name,
  priority = false,
}: {
  readonly id: (typeof LATIN_AMERICA_VEHICLE_BRANDS)[number]["id"];
  readonly name: string;
  readonly priority?: boolean;
}) => (
  <li className="flex shrink-0 items-center">
    <div className="flex h-16 w-[7.5rem] items-center justify-center rounded-xl border border-lcdv-gold-2/25 bg-white/[0.04] px-4 sm:h-[4.5rem] sm:w-[8.5rem] sm:px-5">
      <Image
        src={getVehicleBrandLogoSrc(id)}
        alt={name}
        width={120}
        height={48}
        priority={priority}
        className="h-8 w-auto max-h-9 max-w-[6.5rem] object-contain opacity-90 brightness-0 invert sm:h-9 sm:max-h-10"
      />
    </div>
  </li>
);

const BrandTrack = ({
  ariaHidden = false,
  logoPriority = false,
}: {
  readonly ariaHidden?: boolean;
  readonly logoPriority?: boolean;
}) => (
  <ul
    className="flex items-center gap-4 sm:gap-6"
    aria-hidden={ariaHidden || undefined}
  >
    {LATIN_AMERICA_VEHICLE_BRANDS.map((brand, index) => (
      <BrandLogo
        key={`${ariaHidden ? "dup-" : ""}${brand.id}`}
        id={brand.id}
        name={brand.name}
        priority={logoPriority && index < 4}
      />
    ))}
  </ul>
);

export const VehicleBrandsMarquee = () => {
  return (
    <section
      className="lcdv-section-textured border-y border-lcdv-gold-2/15 py-10 sm:py-12"
      aria-labelledby="vehicle-brands-heading"
    >
      <div className="lcdv-container mb-6 text-center sm:mb-8">
        <p className="lcdv-eyebrow">Mercado latinoamericano</p>
        <h2 id="vehicle-brands-heading" className="lcdv-heading-section mt-3 text-balance">
          Marcas de vehículos que atendemos
        </h2>
        <p className="lcdv-lead mx-auto mt-3 max-w-2xl">
          Tapicería, restauración de interiores y compra/venta de vehículos.
        </p>
      </div>

      <div
        className="lcdv-marquee relative overflow-hidden"
        aria-label="Carrusel de logos de marcas de vehículos"
      >
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[var(--lcdv-surface-bg)] to-transparent sm:w-24"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[var(--lcdv-surface-bg)] to-transparent sm:w-24"
          aria-hidden
        />

        <div className="lcdv-marquee-track flex w-max">
          <BrandTrack logoPriority />
          <BrandTrack ariaHidden />
        </div>
      </div>
    </section>
  );
};
