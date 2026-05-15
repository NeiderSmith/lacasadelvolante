type ServiceIconProps = {
  readonly serviceId: string;
  readonly className?: string;
};

export const ServiceIcon = ({ serviceId, className = "h-7 w-7 shrink-0" }: ServiceIconProps) => {
  const common = `${className} text-lcdv-highlight`;
  switch (serviceId) {
    case "volantes":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="2" fill="currentColor" />
          <path
            d="M12 4v2M12 18v2M4 12h2M18 12h2M6.34 6.34l1.42 1.42M16.24 16.24l1.42 1.42M6.34 17.66l1.42-1.42M16.24 7.76l1.42-1.42"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );
    case "tableros":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="3" y="5" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M7 9h4M7 13h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="17" cy="10" r="1.5" fill="currentColor" />
        </svg>
      );
    case "palancas":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M12 4v14"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M12 18c-2.5 0-4 1.2-4 2.5v.5h8v-.5c0-1.3-1.5-2.5-4-2.5z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="6" r="2.25" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M9.5 10h5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );
    case "asientos":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M5 16c0-2.5 2-4 7-4s7 1.5 7 4v2H5v-2z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M8 12V9a4 4 0 0 1 8 0v3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );
    case "interiores":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M4 17l2-8h12l2 8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M6 9V7a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M9 14h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "venta-vehiculos":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M3 13h1l1.5-4h11L18 13h1"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="7.5" cy="16.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="16.5" cy="16.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M5 16H4M20 16h-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
  }
};
