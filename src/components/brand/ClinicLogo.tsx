"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

/** Logo oficial en public/ — ruta absoluta desde la raíz del sitio */
export const CLINIC_LOGO_PNG = "/brand/clinica-del-nino-logo.png";

export type ClinicLogoVariant = "full" | "compact" | "mark";
export type ClinicLogoTheme = "light" | "dark";

const altByVariant: Record<ClinicLogoVariant, string> = {
  full: "Clínica del Niño SA",
  compact: "Clínica del Niño SA",
  mark: "Clínica del Niño",
};

function LogoFallback({
  className,
  compact,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-display font-bold leading-tight text-medical-deep",
        compact ? "text-sm" : "text-base md:text-lg",
        className
      )}
    >
      Clínica del Niño
    </span>
  );
}

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
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <LogoFallback
        className={className}
        compact={variant === "mark" || variant === "compact"}
      />
    );
  }

  const alt = altByVariant[variant];
  const imgProps = {
    src: CLINIC_LOGO_PNG,
    alt,
    width: 250,
    height: 50,
    onError: () => setFailed(true),
    loading: (priority ? "eager" : "lazy") as "eager" | "lazy",
    decoding: "async" as const,
    ...(priority ? { fetchPriority: "high" as const } : {}),
  };

  let content: React.ReactNode;

  if (variant === "mark") {
    content = (
      <span
        role="img"
        aria-label={alt}
        className={cn(
          "inline-flex shrink-0 overflow-hidden rounded-sm bg-white",
          "h-9 w-9 md:h-10 md:w-10",
          className
        )}
      >
        {/* Recorte del símbolo CDN (porción izquierda del logo horizontal) */}
        <img
          {...imgProps}
          alt=""
          aria-hidden
          className="h-full w-auto max-w-none object-cover object-left"
        />
      </span>
    );
  } else {
    content = (
      <img
        {...imgProps}
        className={cn(
          "max-w-full object-contain object-left",
          variant === "full" ? "h-9 w-auto md:h-11" : "h-8 w-auto sm:h-9",
          className
        )}
      />
    );
  }

  if (theme === "dark" && variant !== "mark") {
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-xl bg-white px-2.5 py-1.5 shadow-soft",
          className
        )}
      >
        <img
          {...imgProps}
          className={cn(
            "max-w-full object-contain object-left",
            variant === "full" ? "h-9 w-auto md:h-11" : "h-8 w-auto sm:h-9"
          )}
        />
      </span>
    );
  }

  return content;
}
