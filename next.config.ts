import fs from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";

/**
 * En Amplify Hosting, `amplify.yml` ejecuta `ampx generate outputs` antes del build;
 * aquí leemos `amplify_outputs.json` y lo inyectamos en el cliente como
 * `NEXT_PUBLIC_AMPLIFY_OUTPUTS` solo si no viene ya definido (p. ej. `.env.local`).
 */
const readAmplifyOutputsFromRepoRoot = (): string | undefined => {
  const filePath = path.join(process.cwd(), "amplify_outputs.json");
  try {
    if (!fs.existsSync(filePath)) return undefined;
    const text = fs.readFileSync(filePath, "utf8").trim();
    return text.length > 0 ? text : undefined;
  } catch {
    return undefined;
  }
};

const amplifyOutputsFromFile = readAmplifyOutputsFromRepoRoot();
const amplifyOutputsFromProcessEnv =
  process.env.NEXT_PUBLIC_AMPLIFY_OUTPUTS?.trim() ?? "";

const nextConfig: NextConfig = {
  env: {
    ...(amplifyOutputsFromFile && !amplifyOutputsFromProcessEnv
      ? { NEXT_PUBLIC_AMPLIFY_OUTPUTS: amplifyOutputsFromFile }
      : {}),
  },
};

export default nextConfig;
