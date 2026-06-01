"use client";

import { AdminAlert } from "@/components/admin/AdminAlert";
import { AdminFormModal } from "@/components/admin/AdminFormModal";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { slugify } from "@/lib/slugify";
import { Pencil, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

type Provider = {
  id: string;
  name: string;
  slug: string;
  active: boolean;
  notes: string | null;
  sortOrder: number;
};

const emptyForm = (): Omit<Provider, "id"> => ({
  name: "",
  slug: "",
  active: true,
  notes: "",
  sortOrder: 0,
});

export default function AdminInsurancePage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [search, setSearch] = useState("");
  const [bulk, setBulk] = useState("");
  const [bulkLoading, setBulkLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Provider | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const load = (q?: string) => {
    const params = q?.trim() ? `?q=${encodeURIComponent(q.trim())}` : "";
    return fetch(`/api/admin/insurance${params}`)
      .then((r) => r.json())
      .then((json) => json.success && setProviders(json.data));
  };

  useEffect(() => {
    const timer = setTimeout(() => load(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm());
    setModalOpen(true);
  }

  function openEdit(provider: Provider) {
    setEditing(provider);
    setForm({
      name: provider.name,
      slug: provider.slug,
      active: provider.active,
      notes: provider.notes || "",
      sortOrder: provider.sortOrder,
    });
    setModalOpen(true);
  }

  async function saveProvider(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      setFeedback({ type: "error", message: "El nombre es obligatorio." });
      return;
    }

    setSaving(true);
    setFeedback(null);

    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim() || slugify(form.name),
      active: form.active,
      notes: form.notes?.trim() || null,
      sortOrder: Number(form.sortOrder) || 0,
    };

    try {
      const res = await fetch("/api/admin/insurance", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing ? { ...payload, id: editing.id } : payload),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        setFeedback({
          type: "error",
          message: json.error || "Error al guardar la obra social.",
        });
        return;
      }

      setModalOpen(false);
      setFeedback({
        type: "success",
        message: editing ? "Obra social actualizada." : "Obra social creada.",
      });
      load(search);
    } catch {
      setFeedback({ type: "error", message: "Error de conexión." });
    } finally {
      setSaving(false);
    }
  }

  async function importBulk() {
    if (!bulk.trim()) {
      setFeedback({ type: "error", message: "Pegá al menos una obra social por línea." });
      return;
    }

    setBulkLoading(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/admin/insurance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bulk }),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        setFeedback({
          type: "error",
          message: json.error || "Error en la carga masiva.",
        });
        return;
      }

      setBulk("");
      setFeedback({
        type: "success",
        message: `${json.data.imported} obra(s) social(es) importada(s). Duplicados se actualizaron.`,
      });
      load(search);
    } catch {
      setFeedback({ type: "error", message: "Error de conexión." });
    } finally {
      setBulkLoading(false);
    }
  }

  async function deleteProvider(provider: Provider) {
    if (!confirm(`¿Eliminar "${provider.name}"?`)) return;

    const res = await fetch(`/api/admin/insurance?id=${provider.id}`, {
      method: "DELETE",
    });
    const json = await res.json();
    if (json.success) {
      setFeedback({ type: "success", message: "Obra social eliminada." });
      load(search);
    } else {
      setFeedback({ type: "error", message: json.error || "No se pudo eliminar." });
    }
  }

  async function toggleActive(provider: Provider) {
    await fetch("/api/admin/insurance", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: provider.id, active: !provider.active }),
    });
    load(search);
  }

  return (
    <div>
      <AdminPageHeader
        title="Obras sociales"
        subtitle={`${providers.length} mostradas`}
        actionLabel="Nueva obra social"
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

      <div className="relative mt-6">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        <input
          type="search"
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-11"
        />
      </div>

      <Card className="mt-6" padding="md">
        <p className="font-medium text-medical-deep">Carga masiva</p>
        <p className="mt-1 text-sm text-text-muted">
          Una obra social por línea. Se evitan duplicados por nombre/slug.
        </p>
        <textarea
          rows={6}
          value={bulk}
          onChange={(e) => setBulk(e.target.value)}
          className="input-field mt-3 resize-none"
          placeholder={"OSDE\nSwiss Medical\nGaleno"}
        />
        <Button
          variant="primary"
          className="mt-3 w-full sm:w-auto"
          onClick={importBulk}
          disabled={bulkLoading}
        >
          {bulkLoading ? "Importando..." : "Importar listado"}
        </Button>
      </Card>

      <div className="mt-6 space-y-3">
        {providers.map((provider) => (
          <Card key={provider.id} padding="md">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-medical-deep">{provider.name}</p>
                {provider.notes && (
                  <p className="mt-1 text-sm text-text-muted">{provider.notes}</p>
                )}
                <p className="mt-1 text-xs text-text-muted">
                  Orden {provider.sortOrder} · {provider.slug}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <label className="flex items-center gap-2 rounded-xl border border-medical-blue/10 px-3 py-2 text-sm">
                  <input
                    type="checkbox"
                    checked={provider.active}
                    onChange={() => toggleActive(provider)}
                  />
                  Activa
                </label>
                <Button variant="outline" size="sm" onClick={() => openEdit(provider)}>
                  <Pencil className="h-4 w-4" />
                  Editar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-medical-coral"
                  onClick={() => deleteProvider(provider)}
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
        title={editing ? "Editar obra social" : "Nueva obra social"}
        onClose={() => !saving && setModalOpen(false)}
      >
        <form onSubmit={saveProvider} className="space-y-4 pb-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Nombre *</label>
            <input
              required
              value={form.name}
              onChange={(e) => {
                const name = e.target.value;
                setForm({
                  ...form,
                  name,
                  slug: editing ? form.slug : slugify(name),
                });
              }}
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Slug</label>
            <input
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="input-field font-mono text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Notas</label>
            <textarea
              rows={2}
              value={form.notes || ""}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
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
            {saving ? "Guardando..." : "Guardar obra social"}
          </Button>
        </form>
      </AdminFormModal>
    </div>
  );
}
