"use client";

import { AdminAlert } from "@/components/admin/AdminAlert";
import { Button } from "@/components/ui/Button";
import { useEffect, useState } from "react";

type VaccineForm = {
  title: string;
  description: string;
  calendarVaccines: string;
  injectablesInfo: string;
  requirements: string;
  schedules: string;
  active: boolean;
};

const EMPTY: VaccineForm = {
  title: "",
  description: "",
  calendarVaccines: "",
  injectablesInfo: "",
  requirements: "",
  schedules: "",
  active: true,
};

const FIELDS: { key: keyof VaccineForm; label: string; rows: number }[] = [
  { key: "title", label: "Título", rows: 1 },
  { key: "description", label: "Descripción general", rows: 3 },
  { key: "calendarVaccines", label: "Vacunas calendario nacional", rows: 4 },
  { key: "injectablesInfo", label: "Inyectables", rows: 4 },
  { key: "requirements", label: "Requisitos / documentación", rows: 4 },
  { key: "schedules", label: "Horarios", rows: 3 },
];

export default function AdminVaccinePage() {
  const [form, setForm] = useState<VaccineForm>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/admin/vaccine")
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data) {
          const d = json.data;
          setForm({
            title: String(d.title ?? ""),
            description: String(d.description ?? ""),
            calendarVaccines: String(d.calendarVaccines ?? ""),
            injectablesInfo: String(d.injectablesInfo ?? ""),
            requirements: String(d.requirements ?? ""),
            schedules: String(d.schedules ?? ""),
            active: d.active !== false,
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/admin/vaccine", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        setFeedback({
          type: "error",
          message: json.error || "No pudimos guardar el vacunatorio.",
        });
        return;
      }

      setFeedback({
        type: "success",
        message: "Vacunatorio guardado correctamente.",
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

  if (loading) {
    return <AdminAlert type="loading" message="Cargando vacunatorio..." />;
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-bold text-medical-deep">Vacunatorio</h1>
      <p className="mt-1 text-sm text-text-muted">
        Contenido de la sección vacunatorio en la web pública.
      </p>

      {feedback && (
        <AdminAlert
          type={feedback.type}
          message={feedback.message}
          onClose={() => setFeedback(null)}
          className="mt-4"
        />
      )}

      <form onSubmit={save} className="mt-6 space-y-4">
        {FIELDS.map((field) => (
          <div key={field.key}>
            <label className="mb-1.5 block text-sm font-medium text-medical-deep">
              {field.label}
            </label>
            <textarea
              rows={field.rows}
              value={form[field.key] as string}
              onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
              className="input-field resize-none"
            />
          </div>
        ))}

        <label className="flex items-center gap-2 rounded-xl border border-medical-blue/10 px-4 py-3 text-sm">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm({ ...form, active: e.target.checked })}
          />
          Sección activa en la web
        </label>

        <Button type="submit" variant="primary" size="lg" className="w-full" disabled={saving}>
          {saving ? "Guardando..." : "Guardar vacunatorio"}
        </Button>
      </form>
    </div>
  );
}
