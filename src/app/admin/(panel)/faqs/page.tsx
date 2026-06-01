"use client";

import { AdminAlert } from "@/components/admin/AdminAlert";
import { AdminFormModal } from "@/components/admin/AdminFormModal";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

type Faq = {
  id: string;
  question: string;
  answer: string;
  active: boolean;
  sortOrder: number;
};

const emptyForm = (): Omit<Faq, "id"> => ({
  question: "",
  answer: "",
  active: true,
  sortOrder: 0,
});

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Faq | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const load = () =>
    fetch("/api/admin/faqs")
      .then((r) => r.json())
      .then((json) => json.success && setFaqs(json.data));

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm());
    setModalOpen(true);
  }

  function openEdit(faq: Faq) {
    setEditing(faq);
    setForm({ ...faq });
    setModalOpen(true);
  }

  async function saveFaq(e: React.FormEvent) {
    e.preventDefault();
    if (!form.question.trim() || !form.answer.trim()) {
      setFeedback({
        type: "error",
        message: "Pregunta y respuesta son obligatorias.",
      });
      return;
    }

    setSaving(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/admin/faqs", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          editing
            ? { ...form, id: editing.id, sortOrder: Number(form.sortOrder) }
            : { ...form, sortOrder: Number(form.sortOrder) }
        ),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        setFeedback({
          type: "error",
          message: json.error || "Error al guardar la pregunta.",
        });
        return;
      }

      setModalOpen(false);
      setFeedback({
        type: "success",
        message: editing ? "Pregunta actualizada." : "Pregunta creada.",
      });
      load();
    } catch {
      setFeedback({ type: "error", message: "Error de conexión." });
    } finally {
      setSaving(false);
    }
  }

  async function deleteFaq(faq: Faq) {
    if (!confirm(`¿Eliminar "${faq.question}"?`)) return;

    const res = await fetch(`/api/admin/faqs?id=${faq.id}`, { method: "DELETE" });
    const json = await res.json();
    if (json.success) {
      setFeedback({ type: "success", message: "Pregunta eliminada." });
      load();
    } else {
      setFeedback({ type: "error", message: json.error || "No se pudo eliminar." });
    }
  }

  async function toggleActive(faq: Faq) {
    await fetch("/api/admin/faqs", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: faq.id, active: !faq.active }),
    });
    load();
  }

  return (
    <div>
      <AdminPageHeader
        title="Preguntas frecuentes"
        subtitle={`${faqs.length} preguntas`}
        actionLabel="Nueva pregunta"
        onAction={openCreate}
      />

      {feedback && (
        <AdminAlert
          type={feedback.type}
          message={feedback.message}
          onClose={() => setFeedback(null)}
          className="mt-4"
        />
      )}

      <div className="mt-6 space-y-3">
        {faqs.map((faq) => (
          <Card key={faq.id} padding="md">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-medical-deep">{faq.question}</p>
                <p className="mt-2 text-sm text-text-muted line-clamp-3">{faq.answer}</p>
                <p className="mt-1 text-xs text-text-muted">Orden {faq.sortOrder}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <label className="flex items-center gap-2 rounded-xl border border-medical-blue/10 px-3 py-2 text-sm">
                  <input
                    type="checkbox"
                    checked={faq.active}
                    onChange={() => toggleActive(faq)}
                  />
                  Activa
                </label>
                <Button variant="outline" size="sm" onClick={() => openEdit(faq)}>
                  <Pencil className="h-4 w-4" />
                  Editar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-medical-coral"
                  onClick={() => deleteFaq(faq)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <AdminFormModal
        open={modalOpen}
        title={editing ? "Editar pregunta" : "Nueva pregunta"}
        onClose={() => !saving && setModalOpen(false)}
      >
        <form onSubmit={saveFaq} className="space-y-4 pb-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Pregunta *</label>
            <input
              required
              value={form.question}
              onChange={(e) => setForm({ ...form, question: e.target.value })}
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Respuesta *</label>
            <textarea
              required
              rows={4}
              value={form.answer}
              onChange={(e) => setForm({ ...form, answer: e.target.value })}
              className="input-field resize-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Orden</label>
            <input
              type="number"
              value={form.sortOrder}
              onChange={(e) =>
                setForm({ ...form, sortOrder: Number(e.target.value) })
              }
              className="input-field"
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
            />
            Activa en la web
          </label>
          <Button type="submit" variant="primary" size="lg" className="w-full" disabled={saving}>
            {saving ? "Guardando..." : "Guardar pregunta"}
          </Button>
        </form>
      </AdminFormModal>
    </div>
  );
}
