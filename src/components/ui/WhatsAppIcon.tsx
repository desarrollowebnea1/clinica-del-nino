import { cn } from "@/lib/utils";
import { FaWhatsapp } from "react-icons/fa";

export function WhatsAppIcon({
  className,
  size = 20,
  variant = "onButton",
}: {
  className?: string;
  size?: number;
  /** Blanco sobre botones verdes; verde oficial en contexto independiente */
  variant?: "onButton" | "brand";
}) {
  return (
    <FaWhatsapp
      size={size}
      className={cn(
        "shrink-0",
        variant === "onButton" ? "text-white" : "text-[#25D366]",
        className
      )}
      aria-hidden
    />
  );
}
