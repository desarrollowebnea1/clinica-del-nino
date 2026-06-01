"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useEffect, useState } from "react";

export default function AdminInsurancePage() {
  const [providers, setProviders] = useState<Array<{ id: string; name: string; active: boolean }>>([]);
  const [bulk, setBulk] = useState("");

  const load = () =>
    fetch("/api/admin/insurance")
      .then((r) => r.json())
      .then((json) => json.success && setProviders(json.data));

  useEffect(() => {
    load();
  }, []);

  async function importBulk() {
    await fetch("/api/admin/insurance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bulk }),
    });
    setBulk("");
    load();
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-medical-blue">
        Obras sociales
      </h1>
      <p className="mt-1 text-text-muted">{providers.length} registradas</p>

      <Card className="mt-6" padding="md">
        <p className="font-medium text-medical-blue">Carga masiva</p>
        <p className="mt-1 text-sm text-text-muted">Una obra social por línea</p>
        <textarea
          rows={6}
          value={bulk}
          onChange={(e) => setBulk(e.target.value)}
          className="mt-3 w-full rounded-xl border border-medical-blue/10 px-4 py-3"
          placeholder="OSDE&#10;Swiss Medical&#10;..."
        />
        <Button variant="primary" className="mt-3" onClick={importBulk}>
          Importar
        </Button>
      </Card>

      <div className="mt-6 flex flex-wrap gap-2">
        {providers.map((p) => (
          <span
            key={p.id}
            className={`rounded-full px-3 py-1 text-sm ${p.active ? "bg-medical-sky text-medical-blue" : "bg-gray-100 text-gray-400 line-through"}`}
          >
            {p.name}
          </span>
        ))}
      </div>
    </div>
  );
}
