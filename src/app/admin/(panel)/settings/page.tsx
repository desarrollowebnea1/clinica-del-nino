"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useEffect, useState } from "react";

export default function AdminSettingsPage() {
  const [form, setForm] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data) {
          const d = json.data;
          setForm({
            clinicName: d.clinicName || "",
            slogan: d.slogan || "",
            whatsappNumber: d.whatsappNumber || "",
            phone: d.phone || "",
            email: d.email || "",
            address: d.address || "",
            mapsUrl: d.mapsUrl || "",
            mapsEmbedUrl: d.mapsEmbedUrl || "",
            heroTitle: d.heroTitle || "",
            heroSubtitle: d.heroSubtitle || "",
            heroDescription: d.heroDescription || "",
            heroImageUrl: d.heroImageUrl || "",
            logoUrl: d.logoUrl || "",
            emergencyNotice: d.emergencyNotice || "",
            legalNotice: d.legalNotice || "",
            openingHoursJson: d.openingHoursJson || "{}",
          });
        }
      });
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        openingHours: JSON.parse(form.openingHoursJson || "{}"),
      }),
    });
    if ((await res.json()).success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  }

  const fields = [
    { key: "clinicName", label: "Nombre clínica" },
    { key: "slogan", label: "Slogan" },
    { key: "whatsappNumber", label: "WhatsApp (con código país)" },
    { key: "phone", label: "Teléfono" },
    { key: "email", label: "Email" },
    { key: "address", label: "Dirección" },
    { key: "mapsUrl", label: "Google Maps URL" },
    { key: "mapsEmbedUrl", label: "Google Maps embed URL" },
    { key: "heroTitle", label: "Hero título" },
    { key: "heroSubtitle", label: "Hero subtítulo" },
    { key: "heroDescription", label: "Hero descripción" },
    { key: "heroImageUrl", label: "Hero imagen URL" },
    { key: "logoUrl", label: "Logo URL" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-medical-blue">
        Configuración general
      </h1>

      <form onSubmit={save} className="mt-6 max-w-2xl space-y-4">
        {fields.map((field) => (
          <div key={field.key}>
            <label className="mb-1 block text-sm font-medium">{field.label}</label>
            <input
              value={form[field.key] || ""}
              onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
              className="w-full rounded-xl border border-medical-blue/10 px-4 py-3"
            />
          </div>
        ))}

        <div>
          <label className="mb-1 block text-sm font-medium">Horarios (JSON)</label>
          <textarea
            rows={4}
            value={form.openingHoursJson || "{}"}
            onChange={(e) =>
              setForm({ ...form, openingHoursJson: e.target.value })
            }
            className="w-full rounded-xl border border-medical-blue/10 px-4 py-3 font-mono text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Aviso emergencias</label>
          <textarea
            rows={3}
            value={form.emergencyNotice || ""}
            onChange={(e) => setForm({ ...form, emergencyNotice: e.target.value })}
            className="w-full rounded-xl border border-medical-blue/10 px-4 py-3"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Aviso legal footer</label>
          <textarea
            rows={3}
            value={form.legalNotice || ""}
            onChange={(e) => setForm({ ...form, legalNotice: e.target.value })}
            className="w-full rounded-xl border border-medical-blue/10 px-4 py-3"
          />
        </div>

        <Button type="submit" variant="primary" size="lg">
          Guardar cambios
        </Button>
        {saved && (
          <p className="text-sm text-medical-teal">Guardado correctamente</p>
        )}
      </form>
    </div>
  );
}
