import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, Loader2, X } from "lucide-react";

type AlertType = "success" | "error" | "loading";

export function AdminAlert({
  type,
  message,
  onClose,
  className,
}: {
  type: AlertType;
  message: string;
  onClose?: () => void;
  className?: string;
}) {
  const styles = {
    success: "border-health-green/40 bg-health-green/10 text-medical-deep",
    error: "border-medical-coral/40 bg-medical-coral/10 text-medical-deep",
    loading: "border-medical-blue/20 bg-medical-sky/50 text-medical-deep",
  };

  const Icon =
    type === "success"
      ? CheckCircle2
      : type === "error"
        ? AlertCircle
        : Loader2;

  return (
    <div
      role={type === "error" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-3 rounded-xl border px-4 py-3 text-sm",
        styles[type],
        className
      )}
    >
      <Icon
        className={cn(
          "mt-0.5 h-5 w-5 shrink-0",
          type === "success" && "text-health-green",
          type === "error" && "text-medical-coral",
          type === "loading" && "animate-spin text-medical-teal"
        )}
      />
      <p className="flex-1 font-medium">{message}</p>
      {onClose && type !== "loading" && (
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-lg p-1 hover:bg-black/5"
          aria-label="Cerrar"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
