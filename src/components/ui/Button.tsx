import Link from "next/link";
import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, type ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "whatsapp" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  external?: boolean;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-medical-deep text-white hover:bg-medical-blue shadow-soft focus-visible:ring-medical-deep",
  secondary:
    "bg-medical-teal text-white hover:bg-medical-teal/90 shadow-soft focus-visible:ring-medical-teal",
  outline:
    "border-2 border-medical-deep/15 bg-white text-medical-deep hover:border-medical-teal hover:bg-medical-sky/60 focus-visible:ring-medical-teal",
  whatsapp:
    "bg-[#25D366] text-white hover:bg-[#20BD5A] shadow-soft focus-visible:ring-[#25D366]",
  ghost:
    "bg-transparent text-medical-deep hover:bg-medical-sky/60 focus-visible:ring-medical-teal",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2.5 text-sm rounded-xl min-h-[44px]",
  md: "px-6 py-3 text-base rounded-2xl min-h-[48px]",
  lg: "px-8 py-4 text-base rounded-2xl font-semibold min-h-[52px]",
};

export function Button({
  variant = "primary",
  size = "md",
  href,
  external,
  children,
  className,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    variantStyles[variant],
    sizeStyles[size],
    className
  );

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
