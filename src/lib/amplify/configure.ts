"use client";

import { Amplify } from "aws-amplify";

let configured = false;

/**
 * Configura Amplify en el navegador (una vez).
 *
 * Origen de la configuración (en este orden):
 * 1. `NEXT_PUBLIC_AMPLIFY_OUTPUTS` definido en el entorno (p. ej. `.env.local`).
 * 2. Si no existe, en **build** Next inyecta el contenido de `amplify_outputs.json`
 *    leído en `next.config.ts` (Amplify Hosting: ver `amplify.yml` + `ampx generate outputs`).
 */
export const configureAmplifyClient = (): boolean => {
  if (configured) return true;
  const raw = process.env.NEXT_PUBLIC_AMPLIFY_OUTPUTS?.trim();
  if (!raw) return false;
  try {
    Amplify.configure(JSON.parse(raw), { ssr: true });
    configured = true;
    return true;
  } catch {
    return false;
  }
};

export const hasAmplifyOutputsEnv = (): boolean =>
  Boolean(process.env.NEXT_PUBLIC_AMPLIFY_OUTPUTS?.trim());
