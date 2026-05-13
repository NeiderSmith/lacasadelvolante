import designStyle from "../../design-style.json";

export type DesignStyle = typeof designStyle;

export const designStyleData: DesignStyle = designStyle;

export const brandName = designStyle.brand;

export const themeColorHex = designStyle.palette.primaryBackground.hex;

/**
 * Convierte design-style.json en variables CSS (--lcdv-*).
 * Sombras y brillos se derivan solo de hex/rgb definidos en el JSON.
 */
export const buildRootCssVariables = (): Record<string, string> => {
  const p = designStyle.palette;
  const tc = designStyle.recommendedTextColors;
  const vars: Record<string, string> = {
    "--lcdv-primary-background": p.primaryBackground.hex,
    "--lcdv-primary-gold": p.primaryGold.hex,
    "--lcdv-secondary-gold": p.secondaryGold.hex,
    "--lcdv-dark-bronze": p.darkBronze.hex,
    "--lcdv-highlight-gold": p.highlightGold.hex,
    "--lcdv-soft-gold": p.softGold.hex,
    "--lcdv-muted-gold": p.mutedGold.hex,
    "--lcdv-light-gold": p.lightGold.hex,
    "--lcdv-text-primary": tc.primaryTextOnDark,
    "--lcdv-text-secondary": tc.secondaryTextOnDark,
    "--lcdv-text-on-gold": tc.darkTextOnGold,
  };

  const [luxuryGradient, darkElegant] = designStyle.recommendedGradients;
  if (luxuryGradient?.css) {
    vars["--lcdv-gradient-luxury-gold"] = luxuryGradient.css;
  }
  if (darkElegant?.css) {
    vars["--lcdv-gradient-dark-elegant"] = darkElegant.css;
  }

  const rgba = (rgb: string, alpha: number) =>
    `rgba(${rgb.replace(/\s/g, "")}, ${alpha})`;

  vars["--lcdv-shadow-soft"] = `0 28px 90px ${rgba(p.darkBronze.rgb, 0.55)}`;
  vars["--lcdv-shadow-card"] =
    `0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px ${rgba(p.secondaryGold.rgb, 0.22)}`;
  vars["--lcdv-shadow-glow"] =
    `0 0 56px ${rgba(p.highlightGold.rgb, 0.35)}, 0 0 140px ${rgba(p.primaryGold.rgb, 0.14)}`;
  vars["--lcdv-shadow-inner-gold"] = `inset 0 1px 0 ${rgba(p.lightGold.rgb, 0.12)}`;
  vars["--lcdv-ring-subtle"] = `0 0 0 1px ${rgba(p.mutedGold.rgb, 0.35)}`;

  return vars;
};

export const rootCssVariablesString = (): string => {
  const entries = Object.entries(buildRootCssVariables());
  return `:root {\n${entries.map(([k, v]) => `  ${k}: ${v};`).join("\n")}\n}`;
};
