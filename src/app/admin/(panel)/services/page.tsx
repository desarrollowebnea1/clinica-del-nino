"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useEffect, useState } from "react";

type Service = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  active: boolean;
  featured: boolean;
  sortOrder: number;
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);

  const load = () =>
    fetch("/api/admin/services")
      .then((r) => r.json())
      .then((json) => json.success && setServices(json.data));

  useEffect(() => {
    load();
  }, []);

  async function toggleActive(id: string, active: boolean) {
    const service = services.find((s) => s.id === id);
    if (!service) return;
    await fetch("/api/admin/services", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...service, active }),
    });
    load();
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-medical-blue">Servicios</h1>
      <p className="mt-1 text-sm text-text-muted">
        {services.length} servicios registrados
      </p>

      <div className="mt-6 space-y-3">
        {services.map((service) => (
          <Card key={service.id} padding="md" className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-medical-blue">{service.name}</p>
              <p className="text-sm text-text-muted">{service.shortDescription}</p>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={service.active}
                onChange={(e) => toggleActive(service.id, e.target.checked)}
              />
              Activo
            </label>
          </Card>
        ))}
      </div>

      <p className="mt-6 text-sm text-text-muted">
        CRUD completo de edición disponible vía API. Podés extender el formulario de
        alta desde el panel en una iteración siguiente.
      </p>
    </div>
  );
}
