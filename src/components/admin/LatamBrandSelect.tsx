"use client";

import {
  LATAM_VEHICLE_BRANDS,
  latamVehicleBrandSelectOptions,
  type LatamVehicleBrand,
} from "@/lib/latam-vehicle-brands";

type LatamBrandSelectProps = {
  readonly id?: string;
  readonly value: string;
  readonly onChange: (next: string) => void;
  readonly selectClassName?: string;
  readonly inputClassName?: string;
};

export const LatamBrandSelect = ({
  id,
  value,
  onChange,
  selectClassName = "rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white outline-none focus:border-zinc-500",
  inputClassName = "rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white outline-none focus:border-zinc-500",
}: LatamBrandSelectProps) => {
  const trimmed = value.trim();
  const inList = (LATAM_VEHICLE_BRANDS as readonly string[]).includes(trimmed);
  const selectKey: string | LatamVehicleBrand | "__custom__" = inList
    ? trimmed
    : trimmed
      ? "__custom__"
      : "";

  const showCustom = selectKey === "__custom__";

  return (
    <div className="grid gap-2">
      <select
        id={id}
        value={selectKey}
        onChange={(e) => {
          const v = e.target.value;
          if (v === "__custom__") {
            onChange(inList ? "" : trimmed);
            return;
          }
          onChange(v);
        }}
        className={selectClassName}
        aria-label="Marca del vehículo"
      >
        {latamVehicleBrandSelectOptions.map((o) => (
          <option key={o.value || "__empty__"} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {showCustom ? (
        <input
          type="text"
          value={inList ? "" : trimmed}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Escribe la marca"
          className={inputClassName}
          aria-label="Marca personalizada"
        />
      ) : null}
    </div>
  );
};
