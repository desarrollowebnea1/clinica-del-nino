"use client";

import { AdminAlert } from "@/components/admin/AdminAlert";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { Button } from "@/components/ui/Button";
import {
  settingsFromDb,
  type ClinicSettingsForm,
} from "@/lib/admin/settings-mapper";
import { useEffect, useState } from "react";

const EMPTY: ClinicSettingsForm = {
  clinicName: "",
  slogan: "",
  whatsappNumber: "",
  phone: "",
  email: "",
  instagramUrl: "",
  facebookUrl: "",
  address: "",
  mapsUrl: "",
  mapsEmbedUrl: "",
  heroTitle: "",
  heroSubtitle: "",
  heroDescription: "",
  heroImageUrl: "",
  logoUrl: "",
  openingHoursJson: "{}",
  emergencyNotice: "",
  legalNotice: "",
};

export default function AdminSettingsPage() {
  const [form, setForm] = useState<ClinicSettingsForm>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data) {
          setForm(settingsFromDb(json.data));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        setFeedback({
          type: "error",
          message: json.error || "No pudimos guardar la configuración.",
        });
        return;
      }

      setForm(settingsFromDb(json.data));
      setFeedback({
        type: "success",
        message: "Configuración guardada correctamente.",
      });
    } catch {
      setFeedback({
        type: "error",
        message: "Error de conexión. Intentá nuevamente.",
      });
    } finally {
      setSaving(false);
    }
  }

  const textFields: { key: keyof ClinicSettingsForm; label: string; multiline?: boolean }[] = [
    { key: "clinicName", label: "Nombre clínica" },
    { key: "slogan", label: "Slogan" },
    { key: "whatsappNumber", label: "WhatsApp (código país + número)" },
    { key: "phone", label: "Teléfono" },
    { key: "email", label: "Email" },
    { key: "instagramUrl", label: "Instagram URL" },
    { key: "facebookUrl", label: "Facebook URL" },
    { key: "address", label: "Dirección" },
    { key: "mapsUrl", label: "Google Maps URL (cómo llegar)" },
    { key: "mapsEmbedUrl", label: "Google Maps embed URL (iframe)" },
    { key: "heroTitle", label: "Hero título" },
    { key: "heroSubtitle", label: "Hero subtítulo" },
    { key: "heroDescription", label: "Hero descripción", multiline: true },
  ];

  if (loading) {
    return <AdminAlert type="loading" message="Cargando configuración..." />;
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-bold text-medical-deep">
        Configuración general
      </h1>
      <p className="mt-1 text-sm text-text-muted">
        Datos de contacto, hero y avisos legales de la web pública.
      </p>

      {feedback && (
        <AdminAlert
          type={feedback.type}
          message={feedback.message}
          onClose={() => setFeedback(null)}
          className="mt-4"
        />
      )}

      <form onSubmit={save} className="mt-6 space-y-5">
        <ImageUploadField
          label="Logo de la clínica"
          folder="logo"
          value={form.logoUrl || null}
          onChange={(url) => setForm({ ...form, logoUrl: url || "" })}
        />

        <ImageUploadField
          label="Imagen del hero"
          folder="hero"
          value={form.heroImageUrl || null}
          onChange={(url) => setForm({ ...form, heroImageUrl: url || "" })}
        />

        {textFields.map((field) => (
          <div key={field.key}>
            <label className="mb-1.5 block text-sm font-medium text-medical-deep">
              {field.label}
            </label>
            {field.multiline ? (
              <textarea
                rows={3}
                value={form[field.key]}
                onChange={(e) =>
                  setForm({ ...form, [field.key]: e.target.value })
                }
                className="input-field resize-none"
              />
            ) : (
              <input
                value={form[field.key]}
                onChange={(e) =>
                  setForm({ ...form, [field.key]: e.target.value })
                }
                className="input-field"
              />
            )}
          </div>
        ))}

        <div>
          <label className="mb-1.5 block text-sm font-medium text-medical-deep">
            Horarios (JSON)
          </label>
          <textarea
            rows={4}
            value={form.openingHoursJson}
            onChange={(e) =>
              setForm({ ...form, openingHoursJson: e.target.value })
            }
            className="input-field resize-none font-mono text-sm"
            placeholder='{"guardia":"24 horas","vacunatorio":"Consultar por WhatsApp"}'
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-medical-deep">
            Aviso emergencias
          </label>
          <textarea
            rows={3}
            value={form.emergencyNotice}
            onChange={(e) =>
              setForm({ ...form, emergencyNotice: e.target.value })
            }
            className="input-field resize-none"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-medical-deep">
            Aviso legal (footer)
          </label>
          <textarea
            rows={3}
            value={form.legalNotice}
            onChange={(e) =>
              setForm({ ...form, legalNotice: e.target.value })
            }
            className="input-field resize-none"
          />
        </div>

        <Button type="submit" variant="primary" size="lg" className="w-full" disabled={saving}>
          {saving ? "Guardando..." : "Guardar cambios"}
        </Button>
      </form>
    </div>
  );
}
