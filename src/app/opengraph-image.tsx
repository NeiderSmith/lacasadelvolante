import { ImageResponse } from "next/og";
import designStyle from "../../design-style.json";

export const alt =
  "La Casa del Volante — tapicería automotriz premium y vehículos en Bucaramanga";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  const bg = designStyle.palette.primaryBackground.hex;
  const grad = designStyle.recommendedGradients[1]?.css ?? `linear-gradient(180deg, ${bg} 0%, #0A111A 100%)`;
  const titleColor = designStyle.recommendedTextColors.primaryTextOnDark;
  const subtitleColor = designStyle.recommendedTextColors.secondaryTextOnDark;
  const accent = designStyle.palette.primaryGold.hex;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 72,
          backgroundImage: grad,
        }}
      >
        <div
          style={{
            width: 120,
            height: 4,
            borderRadius: 4,
            backgroundColor: accent,
            marginBottom: 32,
          }}
        />
        <div
          style={{
            fontSize: 68,
            fontWeight: 700,
            letterSpacing: -1,
            color: titleColor,
            lineHeight: 1.05,
            maxWidth: 900,
          }}
        >
          La Casa del Volante
        </div>
        <div
          style={{
            fontSize: 32,
            marginTop: 20,
            color: subtitleColor,
            maxWidth: 820,
            lineHeight: 1.25,
          }}
        >
          Tapicería automotriz premium · Restauración de interiores · Compra venta
          en Bucaramanga, Santander
        </div>
      </div>
    ),
    { ...size },
  );
}
