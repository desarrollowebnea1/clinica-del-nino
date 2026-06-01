"use client";

import { Button } from "@/components/ui/Button";
import { useEffect, useState } from "react";

export default function AdminVaccinePage() {
  const [form, setForm] = useState<Record<string, string | boolean>>({});

  useEffect(() => {
    fetch("/api/admin/vaccine")
      .then((r) => r.json())
      .then((json) => json.success && json.data && setForm(json.data));
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/admin/vaccine", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
  }

  const fields = [
    "title",
    "description",
    "calendarVaccines",
    "injectablesInfo",
    "requirements",
    "schedules",
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-medical-blue">Vacunatorio</h1>
      <form onSubmit={save} className="mt-6 max-w-2xl space-y-4">
        {fields.map((key) => (
          <div key={key}>
            <label className="mb-1 block text-sm font-medium capitalize">{key}</label>
            <textarea
              rows={key === "title" ? 1 : 3}
              value={String(form[key] || "")}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className="w-full rounded-xl border border-medical-blue/10 px-4 py-3"
            />
          </div>
        ))}
        <Button type="submit" variant="primary">
          Guardar
        </Button>
      </form>
    </div>
  );
}
