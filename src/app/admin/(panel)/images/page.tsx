"use client";

import { AdminAlert } from "@/components/admin/AdminAlert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";

type Asset = {
  id: string;
  url: string;
  filename: string;
  folder: string;
};

const MAX_SIZE = 5 * 1024 * 1024;
const ACCEPT = "image/jpeg,image/png,image/webp,image/*";

export default function AdminImagesPage() {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const load = () =>
    fetch("/api/admin/upload")
      .then((r) => r.json())
      .then((json) => json.success && setAssets(json.data));

  useEffect(() => {
    load();
  }, []);

  async function handleFile(file: File) {
    setError(null);
    setFeedback(null);

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
      formData.append("folder", "general");

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(json.error || "Error al subir la imagen");
        return;
      }

      setFeedback({ type: "success", message: "Imagen subida correctamente." });
      load();
    } catch {
      setError("Error de conexión al subir la imagen");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function deleteAsset(asset: Asset) {
    if (!confirm(`¿Eliminar "${asset.filename}" del registro?`)) return;

    const res = await fetch(`/api/admin/upload?id=${asset.id}`, {
      method: "DELETE",
    });
    const json = await res.json();
    if (json.success) {
      setFeedback({ type: "success", message: "Imagen eliminada del panel." });
      load();
    } else {
      setFeedback({ type: "error", message: json.error || "No se pudo eliminar." });
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-medical-deep">Imágenes</h1>
      <p className="mt-1 text-sm text-text-muted">
        Biblioteca en Vercel Blob · JPG, PNG, WEBP · máx. 5MB
      </p>

      {feedback && (
        <AdminAlert
          type={feedback.type}
          message={feedback.message}
          onClose={() => setFeedback(null)}
          className="mt-4"
        />
      )}

      <Card className="mt-6" padding="md">
        <label
          htmlFor={inputId}
          className={cn(
            "flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-medical-teal/40 bg-medical-sky/30 px-4 py-8 text-center transition hover:border-medical-teal",
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
            Desde PC, celular, fototeca o archivos
          </span>
        </label>
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
        {error && <p className="mt-2 text-sm text-medical-coral">{error}</p>}
      </Card>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {assets.map((asset) => (
          <Card key={asset.id} padding="sm">
            <div className="relative aspect-video overflow-hidden rounded-xl bg-medical-sky/30">
              <Image
                src={asset.url}
                alt={asset.filename}
                fill
                className="object-contain p-2"
              />
            </div>
            <p className="mt-2 truncate text-xs font-medium text-medical-deep">
              {asset.filename}
            </p>
            <p className="text-xs text-text-muted">{asset.folder}</p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="mt-2 w-full text-medical-coral"
              onClick={() => deleteAsset(asset)}
            >
              <Trash2 className="h-4 w-4" />
              Eliminar
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
