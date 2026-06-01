"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Image from "next/image";
import { useEffect, useState } from "react";

type Asset = {
  id: string;
  url: string;
  filename: string;
  folder: string;
};

export default function AdminImagesPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [uploading, setUploading] = useState(false);

  const load = () =>
    fetch("/api/admin/upload")
      .then((r) => r.json())
      .then((json) => json.success && setAssets(json.data));

  useEffect(() => {
    load();
  }, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "general");
    await fetch("/api/admin/upload", { method: "POST", body: formData });
    setUploading(false);
    load();
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-medical-blue">Imágenes</h1>
      <p className="mt-1 text-sm text-text-muted">JPG, PNG, WEBP · máx. 5MB</p>

      <Card className="mt-6" padding="md">
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-medical-teal/40 bg-medical-sky/30 px-6 py-10">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            capture="environment"
            className="hidden"
            onChange={handleUpload}
          />
          <p className="font-medium text-medical-blue">
            {uploading ? "Subiendo..." : "Subir imagen desde PC o celular"}
          </p>
        </label>
      </Card>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
        {assets.map((asset) => (
          <Card key={asset.id} padding="sm">
            <div className="relative aspect-square overflow-hidden rounded-xl">
              <Image src={asset.url} alt={asset.filename} fill className="object-cover" />
            </div>
            <p className="mt-2 truncate text-xs text-text-muted">{asset.filename}</p>
            <input
              readOnly
              value={asset.url}
              className="mt-1 w-full truncate rounded border px-2 py-1 text-xs"
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
          </Card>
        ))}
      </div>
    </div>
  );
}
