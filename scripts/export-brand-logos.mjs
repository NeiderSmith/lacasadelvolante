/**
 * Exporta logos SVG desde simple-icons a public/brands/
 * Ejecutar: node scripts/export-brand-logos.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as si from "simple-icons";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "public", "brands");

const MAP = {
  toyota: "siToyota",
  chevrolet: "siChevrolet",
  renault: "siRenault",
  nissan: "siNissan",
  mazda: "siMazda",
  kia: "siKia",
  hyundai: "siHyundai",
  ford: "siFord",
  volkswagen: "siVolkswagen",
  fiat: "siFiat",
  peugeot: "siPeugeot",
  citroen: "siCitroen",
  mitsubishi: "siMitsubishi",
  honda: "siHonda",
  suzuki: "siSuzuki",
  jeep: "siJeep",
  bmw: "siBmw",
  audi: "siAudi",
  volvo: "siVolvo",
  subaru: "siSubaru",
  ram: "siRam",
};

fs.mkdirSync(outDir, { recursive: true });

for (const [slug, key] of Object.entries(MAP)) {
  const icon = si[key];
  if (!icon) {
    console.warn("Missing icon:", slug);
    continue;
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 24 24"><title>${icon.title}</title><path fill="currentColor" d="${icon.path}"/></svg>`;
  fs.writeFileSync(path.join(outDir, `${slug}.svg`), svg);
  console.log("OK", slug);
}
