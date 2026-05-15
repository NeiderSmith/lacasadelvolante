"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useFeaturedVehicles } from "@/hooks/use-featured-vehicles";
import { hasAmplifyOutputsEnv } from "@/lib/amplify/configure";
import {
  VEHICLE_TYPE_LABELS,
  matchesVehicleFilters,
  type VehicleTypeLabel,
} from "@/lib/vehicle-filters";
import { whatsappHref } from "@/lib/site-config";
import { VehicleListingCard } from "@/components/vehicle-listing/VehicleListingCard";

const parseOptionalCOP = (raw: string): number | null => {
  const t = raw.trim().replace(/\s/g, "");
  if (!t) return null;
  const n = Number.parseInt(t.replace(/\D/g, ""), 10);
  return Number.isFinite(n) ? n : null;
};

const ROWS = 3;

const getColumnsForWidth = (width: number) => {
  if (width >= 768) return 3;
  if (width >= 640) return 2;
  return 1;
};

const useMarketplacePageSize = () => {
  const [pageSize, setPageSize] = useState(() =>
    typeof window === "undefined" ? 9 : ROWS * getColumnsForWidth(window.innerWidth),
  );

  useEffect(() => {
    const handleResize = () => setPageSize(ROWS * getColumnsForWidth(window.innerWidth));
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return pageSize;
};

const marketplaceGridClass =
  "grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 md:grid-cols-3";

export const VehiclesMarketplace = () => {
  const { vehicles, loading } = useFeaturedVehicles();
  const useRemote = hasAmplifyOutputsEnv();
  const [minInput, setMinInput] = useState("");
  const [maxInput, setMaxInput] = useState("");
  const [vehicleType, setVehicleType] = useState<VehicleTypeLabel | "todos">("todos");
  const [page, setPage] = useState(1);
  const pageSize = useMarketplacePageSize();

  const filters = useMemo(() => {
    const minCOP = parseOptionalCOP(minInput);
    const maxCOP = parseOptionalCOP(maxInput);
    return {
      minCOP,
      maxCOP,
      vehicleType,
    };
  }, [minInput, maxInput, vehicleType]);

  const filtered = useMemo(
    () => vehicles.filter((v) => matchesVehicleFilters(v, filters)),
    [vehicles, filters],
  );

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));

  const safePage = Math.min(page, pageCount);

  useEffect(() => {
    setPage(1);
  }, [minInput, maxInput, vehicleType]);

  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  const displayed = useMemo(
    () => filtered.slice((safePage - 1) * pageSize, safePage * pageSize),
    [filtered, safePage, pageSize],
  );

  const rangeStart = filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const rangeEnd = Math.min(safePage * pageSize, filtered.length);

  const showEmptyRemote = !loading && vehicles.length === 0 && useRemote;
  const showGrid = !loading && !showEmptyRemote;

  const handleMinChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setMinInput(e.target.value);
  };

  const handleMaxChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setMaxInput(e.target.value);
  };

  const handleVehicleTypeChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    setVehicleType(e.target.value as VehicleTypeLabel | "todos");
  };

  const handleResetFilters = () => {
    setMinInput("");
    setMaxInput("");
    setVehicleType("todos");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <nav aria-label="Migas de pan" className="mb-8 font-sans text-sm text-lcdv-muted">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="transition-colors hover:text-lcdv-highlight">
              Inicio
            </Link>
          </li>
          <li aria-hidden className="text-lcdv-gold-2/45">
            /
          </li>
          <li className="font-medium text-lcdv-text">Marketplace</li>
        </ol>
      </nav>

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
        <aside
          className="lcdv-textured-panel w-full shrink-0 rounded-2xl p-5 lg:sticky lg:top-28 lg:max-h-[calc(100dvh-7.5rem)] lg:w-72 lg:overflow-y-auto lg:overscroll-contain xl:w-80"
          role="search"
          aria-label="Filtros"
        >
          <h2 className="mb-4 font-display text-lg font-semibold text-lcdv-text">Filtros</h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="filtro-categoria" className="sr-only">
                Categoría
              </label>
              <div className="relative">
                <select
                  id="filtro-categoria"
                  value={vehicleType}
                  onChange={handleVehicleTypeChange}
                  className="lcdv-input w-full cursor-pointer appearance-none bg-lcdv-bg pr-10"
                >
                  <option value="todos">Todos</option>
                  {VEHICLE_TYPE_LABELS.map((label) => (
                    <option key={label} value={label}>
                      {label}
                    </option>
                  ))}
                </select>
                <span
                  className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-lcdv-muted"
                  aria-hidden
                >
                  <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="precio-min-cop" className="mb-1 block text-xs text-lcdv-muted">
                  Mín.
                </label>
                <input
                  id="precio-min-cop"
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder="COP"
                  value={minInput}
                  onChange={handleMinChange}
                  className="lcdv-input tabular-nums text-sm focus:outline-none focus:ring-2 focus:ring-lcdv-highlight/35"
                  aria-label="Precio mínimo en pesos colombianos"
                />
              </div>
              <div>
                <label htmlFor="precio-max-cop" className="mb-1 block text-xs text-lcdv-muted">
                  Máx.
                </label>
                <input
                  id="precio-max-cop"
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder="COP"
                  value={maxInput}
                  onChange={handleMaxChange}
                  className="lcdv-input tabular-nums text-sm focus:outline-none focus:ring-2 focus:ring-lcdv-highlight/35"
                  aria-label="Precio máximo en pesos colombianos"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetFilters}
              className="lcdv-btn-secondary w-full !normal-case tracking-normal"
            >
              Limpiar
            </button>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          {loading ? (
            <ul className={marketplaceGridClass} aria-busy="true" aria-label="Cargando vehículos">
              {Array.from({ length: pageSize }, (_, i) => (
                <li
                  key={i}
                  className="lcdv-inventory-card overflow-hidden rounded-2xl border border-lcdv-highlight/30"
                >
                  <div className="aspect-[5/3] animate-pulse bg-lcdv-text-dark/10" />
                  <div className="space-y-3 p-5">
                    <div className="h-5 w-3/4 animate-pulse rounded bg-lcdv-text-dark/10" />
                    <div className="h-3 w-full animate-pulse rounded bg-lcdv-text-dark/10" />
                    <div className="h-10 w-1/2 animate-pulse rounded bg-lcdv-text-dark/10" />
                  </div>
                </li>
              ))}
            </ul>
          ) : showEmptyRemote ? (
            <div className="lcdv-textured-panel px-6 py-14 text-center">
              <p className="font-sans text-sm text-lcdv-text-2 sm:text-base">
                En este momento no hay vehículos publicados en la web. Escribe por WhatsApp y te
                contamos el inventario disponible.
              </p>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="lcdv-btn-primary mt-6 inline-flex"
              >
                Consultar por WhatsApp
              </a>
            </div>
          ) : showGrid ? (
            <>
              <div className="mb-6 flex flex-col gap-3 border-b border-lcdv-gold-2/25 pb-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-sans text-sm text-lcdv-text-2" aria-live="polite">
                  {filtered.length === 0 ? null : (
                    <>
                      Mostrando{" "}
                      <span className="font-semibold text-lcdv-text">
                        {rangeStart === rangeEnd
                          ? `${rangeEnd}`
                          : `${rangeStart}–${rangeEnd}`}
                      </span>{" "}
                      de {filtered.length} vehículo
                      {filtered.length === 1 ? "" : "s"}
                    </>
                  )}
                  {filtered.length !== vehicles.length && vehicles.length > 0 ? (
                    <span className="text-lcdv-muted"> · {vehicles.length} total</span>
                  ) : null}
                </p>
                {vehicleType !== "todos" ? (
                  <p className="font-sans text-xs text-lcdv-muted sm:text-right">
                    {vehicleType}
                  </p>
                ) : null}
              </div>

              {filtered.length === 0 ? (
                <div className="lcdv-textured-panel px-6 py-14 text-center">
                  <p className="font-sans text-sm text-lcdv-text-2 sm:text-base">
                    Sin resultados con estos filtros.
                  </p>
                </div>
              ) : (
                <>
                  <ul id="listado-marketplace-vehiculos" className={marketplaceGridClass}>
                    {displayed.map((v, i) => (
                      <VehicleListingCard key={v.id} vehicle={v} whatsappHref={whatsappHref} listIndex={i} />
                    ))}
                  </ul>
                  <nav
                    className="mt-10 flex flex-wrap items-center justify-center gap-2 pb-2"
                    aria-label="Paginación del listado de vehículos"
                  >
                    <button
                      type="button"
                      disabled={safePage <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="min-h-[44px] min-w-[44px] rounded border border-lcdv-gold-2/35 px-3 text-sm font-medium text-lcdv-text transition enabled:hover:border-lcdv-highlight enabled:hover:text-lcdv-light disabled:opacity-35"
                      aria-label="Página anterior"
                    >
                      ←
                    </button>
                    {Array.from({ length: pageCount }, (_, idx) => idx + 1).map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setPage(n)}
                        className={
                          n === safePage
                            ? "min-h-[44px] min-w-[44px] rounded bg-lcdv-highlight px-3 text-sm font-semibold text-lcdv-text-dark"
                            : "min-h-[44px] min-w-[44px] rounded border border-lcdv-gold-2/25 px-3 text-sm text-lcdv-text-2 transition hover:border-lcdv-highlight hover:text-lcdv-text"
                        }
                        aria-label={`Ir a la página ${n}`}
                        aria-current={n === safePage ? "page" : undefined}
                      >
                        {n}
                      </button>
                    ))}
                    <button
                      type="button"
                      disabled={safePage >= pageCount}
                      onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                      className="min-h-[44px] min-w-[44px] rounded border border-lcdv-gold-2/35 px-3 text-sm font-medium text-lcdv-text transition enabled:hover:border-lcdv-highlight enabled:hover:text-lcdv-light disabled:opacity-35"
                      aria-label="Página siguiente"
                    >
                      →
                    </button>
                  </nav>
                </>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};
