"use client";

import { AdminAlert } from "@/components/admin/AdminAlert";
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
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/admin/content")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) {
          setItems(json.data);
          const initial: Record<string, string> = {};
          for (const item of json.data as ContentItem[]) {
            initial[item.id] = item.value;
          }
          setDrafts(initial);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  async function saveItem(item: ContentItem) {
    const value = drafts[item.id] ?? item.value;
    setSavingId(item.id);
    setFeedback(null);

    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...item, value }),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        setFeedback({
          type: "error",
          message: json.error || `Error al guardar ${item.label}.`,
        });
        return;
      }

      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, value } : i))
      );
      setFeedback({
        type: "success",
        message: `"${item.label}" guardado correctamente.`,
      });
    } catch {
      setFeedback({
        type: "error",
        message: "Error de conexión.",
      });
    } finally {
      setSavingId(null);
    }
  }

  if (loading) {
    return <AdminAlert type="loading" message="Cargando contenido..." />;
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-bold text-medical-deep">
        Contenido de la web
      </h1>
      <p className="mt-1 text-sm text-text-muted">
        Textos editables de secciones importantes. Guardá cada bloque con su botón.
      </p>

      {feedback && (
        <AdminAlert
          type={feedback.type}
          message={feedback.message}
          onClose={() => setFeedback(null)}
          className="mt-4"
        />
      )}

      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <Card key={item.id} padding="md">
            <p className="text-xs font-medium uppercase tracking-wide text-medical-teal">
              {item.section} / {item.key}
            </p>
            <p className="mt-1 font-medium text-medical-deep">{item.label}</p>
            <textarea
              rows={4}
              value={drafts[item.id] ?? ""}
              onChange={(e) =>
                setDrafts((prev) => ({ ...prev, [item.id]: e.target.value }))
              }
              className="input-field mt-3 resize-none"
            />
            <Button
              type="button"
              variant="outline"
              size="md"
              className="mt-3 w-full sm:w-auto"
              disabled={savingId === item.id}
              onClick={() => saveItem(item)}
            >
              {savingId === item.id ? "Guardando..." : "Guardar este texto"}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
