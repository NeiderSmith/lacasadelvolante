type SectionHeaderProps = {
  readonly eyebrow: string;
  readonly title: string;
  readonly titleId: string;
  readonly description?: string;
  readonly align?: "left" | "center";
  readonly variant?: "default" | "on-textured";
  readonly className?: string;
};

export const SectionHeader = ({
  eyebrow,
  title,
  titleId,
  description,
  align = "left",
  variant = "default",
  className = "",
}: SectionHeaderProps) => {
  const alignClass = align === "center" ? "text-center mx-auto" : "";
  const variantClass = variant === "on-textured" ? "lcdv-section-intro" : "max-w-2xl";

  return (
    <header className={`${alignClass} ${variantClass} ${className}`.trim()}>
      <p className="lcdv-eyebrow">{eyebrow}</p>
      <h2 id={titleId} className="lcdv-heading-section mt-3">
        {title}
      </h2>
      {description ? (
        <p className="lcdv-lead mt-4">{description}</p>
      ) : null}
    </header>
  );
};
