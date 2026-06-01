"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useEffect, useState } from "react";

type ContentItem = {
  id: string;
  section: string;
  key: string;
  label: string;
  value: string;
};

export default function AdminContentPage() {
  const [items, setItems] = useState<ContentItem[]>([]);

  useEffect(() => {
    fetch("/api/admin/content")
      .then((r) => r.json())
      .then((json) => json.success && setItems(json.data));
  }, []);

  async function saveItem(item: ContentItem) {
    await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-medical-blue">
        Contenido de la web
      </h1>
      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <Card key={item.id} padding="md">
            <p className="text-xs font-medium uppercase text-medical-teal">
              {item.section} / {item.key}
            </p>
            <p className="text-sm text-text-muted">{item.label}</p>
            <textarea
              rows={3}
              defaultValue={item.value}
              onBlur={(e) => saveItem({ ...item, value: e.target.value })}
              className="mt-2 w-full rounded-xl border border-medical-blue/10 px-4 py-3 text-sm"
            />
          </Card>
        ))}
      </div>
      <p className="mt-4 text-sm text-text-muted">
        Los cambios se guardan al salir de cada campo (blur).
      </p>
    </div>
  );
}
