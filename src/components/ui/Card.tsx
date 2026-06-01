import { cn } from "@/lib/utils";
import { type HTMLAttributes, type ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
  padding?: "sm" | "md" | "lg" | "none";
}

const paddingStyles = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({
  children,
  hover = false,
  padding = "md",
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-medical-blue/10 bg-white shadow-soft",
        paddingStyles[padding],
        hover &&
          "transition-all duration-300 hover:-translate-y-0.5 hover:border-medical-teal/20 hover:shadow-card",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
