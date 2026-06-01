import { cn } from "@/lib/utils";

const LOGO_FULL = "/brand/clinica-del-nino-logo-clean.svg";
const LOGO_MARK = "/brand/clinica-del-nino-logo-mark.svg";

export type ClinicLogoVariant = "full" | "compact" | "mark";
export type ClinicLogoTheme = "light" | "dark";

const variantConfig: Record<
  ClinicLogoVariant,
  { src: string; alt: string; heightClass: string }
> = {
  full: {
    src: LOGO_FULL,
    alt: "Clínica del Niño SA — logo institucional",
    heightClass: "h-9 w-auto md:h-11",
  },
  compact: {
    src: LOGO_FULL,
    alt: "Clínica del Niño SA",
    heightClass: "h-8 w-auto sm:h-9",
  },
  mark: {
    src: LOGO_MARK,
    alt: "Clínica del Niño — símbolo CDN",
    heightClass: "h-9 w-9 md:h-10 md:w-10",
  },
};

export function ClinicLogo({
  variant = "full",
  theme = "light",
  className,
  priority = false,
}: {
  variant?: ClinicLogoVariant;
  theme?: ClinicLogoTheme;
  className?: string;
  priority?: boolean;
}) {
  const config = variantConfig[variant];

  const logoImage = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={config.src}
      alt={config.alt}
      width={variant === "mark" ? 80 : 280}
      height={variant === "mark" ? 80 : 56}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={cn(
        "max-w-full object-contain object-left",
        config.heightClass
      )}
    />
  );

  if (theme === "dark") {
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-xl bg-white px-2.5 py-1.5 shadow-soft",
          className
        )}
      >
        {logoImage}
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-center", className)}>{logoImage}</span>
  );
}

export const CLINIC_LOGO_PNG = "/brand/clinica-del-nino-logo.png";
