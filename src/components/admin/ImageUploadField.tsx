"use client";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import Image from "next/image";
import { useId, useRef, useState } from "react";

const MAX_SIZE = 5 * 1024 * 1024;
const ACCEPT = "image/jpeg,image/png,image/webp,image/*";

export function ImageUploadField({
  label,
  value,
  folder,
  onChange,
  className,
}: {
  label: string;
  value: string | null | undefined;
  folder: string;
  onChange: (url: string | null) => void;
  className?: string;
}) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);

    if (!file.type.startsWith("image/")) {
      setError("Formato no permitido. Usá JPG, PNG o WEBP.");
      return;
    }

    if (file.size > MAX_SIZE) {
      setError("El archivo supera el máximo de 5MB.");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(json.error || "Error al subir la imagen");
        return;
      }

      onChange(json.data.url as string);
    } catch {
      setError("Error de conexión al subir la imagen");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      <span className="block text-sm font-medium text-medical-deep">{label}</span>

      {value ? (
        <div className="relative overflow-hidden rounded-2xl border border-medical-blue/10 bg-medical-sky/30">
          <div className="relative aspect-video w-full max-h-48">
            <Image src={value} alt={label} fill className="object-contain p-2" />
          </div>
          <div className="flex flex-wrap gap-2 border-t border-medical-blue/10 bg-white p-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ImagePlus className="h-4 w-4" />
              )}
              Reemplazar
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-medical-coral hover:bg-medical-coral/10"
              disabled={uploading}
              onClick={() => onChange(null)}
            >
              <Trash2 className="h-4 w-4" />
              Eliminar
            </Button>
          </div>
        </div>
      ) : (
        <label
          htmlFor={inputId}
          className={cn(
            "flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-medical-teal/40 bg-medical-sky/30 px-4 py-8 text-center transition hover:border-medical-teal hover:bg-medical-sky/50",
            uploading && "pointer-events-none opacity-60"
          )}
        >
          {uploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-medical-teal" />
          ) : (
            <ImagePlus className="h-8 w-8 text-medical-teal" />
          )}
          <span className="mt-2 text-sm font-medium text-medical-deep">
            {uploading ? "Subiendo imagen..." : "Subir imagen"}
          </span>
          <span className="mt-1 text-xs text-text-muted">
            JPG, PNG o WEBP · máx. 5MB · PC o celular
          </span>
        </label>
      )}

      <input
        id={inputId}
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="sr-only"
        disabled={uploading}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
        }}
      />

      {error && <p className="text-sm text-medical-coral">{error}</p>}
    </div>
  );
}
