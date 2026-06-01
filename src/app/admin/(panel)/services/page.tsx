"use client";

import { AdminAlert } from "@/components/admin/AdminAlert";
import { AdminFormModal } from "@/components/admin/AdminFormModal";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { slugify } from "@/lib/slugify";
import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

type Service = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  icon: string;
  imageUrl: string | null;
  category: string | null;
  active: boolean;
  featured: boolean;
  sortOrder: number;
};

const ICON_OPTIONS = [
  "heart-pulse",
  "building-2",
  "scissors",
  "syringe",
  "baby",
  "activity",
  "flask-conical",
  "scan",
  "clipboard-list",
  "stethoscope",
];

const emptyForm = (): Omit<Service, "id"> => ({
  name: "",
  slug: "",
  shortDescription: "",
  longDescription: "",
  icon: "stethoscope",
  imageUrl: null,
  category: "",
  active: true,
  featured: false,
  sortOrder: 0,
});

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const load = () =>
    fetch("/api/admin/services")
      .then((r) => r.json())
      .then((json) => json.success && setServices(json.data));

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm());
    setModalOpen(true);
  }

  function openEdit(service: Service) {
    setEditing(service);
    setForm({ ...service });
    setModalOpen(true);
  }

  async function saveService(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      setFeedback({ type: "error", message: "El nombre es obligatorio." });
      return;
    }

    setSaving(true);
    setFeedback(null);

    const payload = {
      ...form,
      slug: form.slug.trim() || slugify(form.name),
      sortOrder: Number(form.sortOrder) || 0,
      category: form.category?.trim() || null,
      imageUrl: form.imageUrl || null,
    };

    try {
      const res = await fetch("/api/admin/services", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing ? { ...payload, id: editing.id } : payload),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        setFeedback({
          type: "error",
          message: json.error || "Error al guardar el servicio.",
        });
        return;
      }

      setModalOpen(false);
      setFeedback({
        type: "success",
        message: editing ? "Servicio actualizado." : "Servicio creado.",
      });
      load();
    } catch {
      setFeedback({ type: "error", message: "Error de conexión." });
    } finally {
      setSaving(false);
    }
  }

  async function deleteService(service: Service) {
    if (!confirm(`¿Eliminar "${service.name}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    const res = await fetch(`/api/admin/services?id=${service.id}`, {
      method: "DELETE",
    });
    const json = await res.json();
    if (json.success) {
      setFeedback({ type: "success", message: "Servicio eliminado." });
      load();
    } else {
      setFeedback({ type: "error", message: json.error || "No se pudo eliminar." });
    }
  }

  async function toggleActive(service: Service) {
    await fetch("/api/admin/services", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: service.id, active: !service.active }),
    });
    load();
  }

  return (
    <div>
      <AdminPageHeader
        title="Servicios"
        subtitle={`${services.length} servicios`}
        actionLabel="Nuevo servicio"
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
        {services.map((service) => (
          <Card key={service.id} padding="md">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-medical-deep">{service.name}</p>
                  {service.featured && (
                    <span className="rounded-full bg-medical-teal/15 px-2 py-0.5 text-xs font-medium text-medical-teal">
                      Destacado
                    </span>
                  )}
                  {!service.active && (
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                      Inactivo
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-text-muted line-clamp-2">
                  {service.shortDescription}
                </p>
                <p className="mt-1 text-xs text-text-muted">
                  Orden {service.sortOrder} · {service.slug}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <label className="flex items-center gap-2 rounded-xl border border-medical-blue/10 px-3 py-2 text-sm">
                  <input
                    type="checkbox"
                    checked={service.active}
                    onChange={() => toggleActive(service)}
                  />
                  Activo
                </label>
                <Button variant="outline" size="sm" onClick={() => openEdit(service)}>
                  <Pencil className="h-4 w-4" />
                  Editar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-medical-coral"
                  onClick={() => deleteService(service)}
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
        title={editing ? "Editar servicio" : "Nuevo servicio"}
        onClose={() => !saving && setModalOpen(false)}
      >
        <form onSubmit={saveService} className="space-y-4 pb-4">
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
            <label className="mb-1 block text-sm font-medium">Descripción corta</label>
            <textarea
              rows={2}
              value={form.shortDescription}
              onChange={(e) =>
                setForm({ ...form, shortDescription: e.target.value })
              }
              className="input-field resize-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Descripción larga</label>
            <textarea
              rows={3}
              value={form.longDescription}
              onChange={(e) =>
                setForm({ ...form, longDescription: e.target.value })
              }
              className="input-field resize-none"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Categoría</label>
              <input
                value={form.category || ""}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Ícono</label>
              <select
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                className="input-field"
              >
                {ICON_OPTIONS.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
            </div>
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
          <ImageUploadField
            label="Imagen del servicio"
            folder="services"
            value={form.imageUrl}
            onChange={(url) => setForm({ ...form, imageUrl: url })}
          />
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
              />
              Activo
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              />
              Destacado
            </label>
          </div>
          <Button type="submit" variant="primary" size="lg" className="w-full" disabled={saving}>
            {saving ? "Guardando..." : "Guardar servicio"}
          </Button>
        </form>
      </AdminFormModal>
    </div>
  );
}
