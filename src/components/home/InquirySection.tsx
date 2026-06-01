"use client";

import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/home/SectionHeading";
import { cn } from "@/lib/utils";
import type { Service } from "@prisma/client";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Hash,
  MessageCircle,
  Search,
  Shield,
} from "lucide-react";
import { useRef, useState } from "react";

const INITIAL_FORM = {
  childName: "",
  childAge: "",
  guardianName: "",
  guardianPhone: "",
  serviceRequested: "",
  insuranceProvider: "",
  reason: "",
  message: "",
};

const API_INQUIRIES = "/api/public/inquiries";

export function InquirySection({ services }: { services: Service[] }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{
    code: string;
    whatsappUrl: string | null;
  } | null>(null);
  const [statusCode, setStatusCode] = useState("");
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [statusResult, setStatusResult] = useState<{
    status: string;
    serviceRequested: string;
  } | null>(null);

  const successRef = useRef<HTMLDivElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading || submitted) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(API_INQUIRIES, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      let json: { success?: boolean; error?: string; data?: { inquiry: { inquiryCode: string }; whatsappUrl: string | null } };
      try {
        json = await res.json();
      } catch {
        setError("No pudimos registrar la solicitud. Intentá nuevamente.");
        return;
      }

      if (!res.ok || !json.success || !json.data?.inquiry?.inquiryCode) {
        setError(
          json.error || "No pudimos registrar la solicitud. Intentá nuevamente."
        );
        return;
      }

      const code = json.data.inquiry.inquiryCode;
      const whatsappUrl = json.data.whatsappUrl ?? null;

      setSuccess({ code, whatsappUrl });
      setSubmitted(true);
      setForm(INITIAL_FORM);
      setStatusCode(code);

      requestAnimationFrame(() => {
        successRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      });

      if (whatsappUrl) {
        window.setTimeout(() => {
          window.open(whatsappUrl, "_blank", "noopener,noreferrer");
        }, 500);
      }
    } catch {
      setError("No pudimos registrar la solicitud. Intentá nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  function handleNewRequest() {
    setSubmitted(false);
    setSuccess(null);
    setError(null);
    setForm(INITIAL_FORM);
  }

  async function checkStatus(e: React.FormEvent) {
    e.preventDefault();
    const code = statusCode.trim();
    if (!code) return;

    setStatusLoading(true);
    setStatusError(null);
    setStatusResult(null);

    try {
      const res = await fetch(
        `/api/public/inquiries/${encodeURIComponent(code)}`
      );
      const json = await res.json();

      if (!res.ok || !json.success) {
        setStatusError(json.error || "Solicitud no encontrada");
        return;
      }

      setStatusResult(json.data);
    } catch {
      setStatusError("Error de conexión. Intentá nuevamente.");
    } finally {
      setStatusLoading(false);
    }
  }

  const statusLabels: Record<string, string> = {
    NUEVA: "Nueva",
    CONTACTADA: "Contactada",
    EN_SEGUIMIENTO: "En seguimiento",
    RESUELTA: "Resuelta",
    CANCELADA: "Cancelada",
  };

  const trustItems = [
    {
      icon: CheckCircle2,
      title: "Solicitud registrada",
      text: "Tu pedido queda guardado en nuestro sistema institucional.",
    },
    {
      icon: Hash,
      title: "Código de seguimiento",
      text: "Recibís un código CDN para consultar el estado cuando quieras.",
    },
    {
      icon: MessageCircle,
      title: "Respuesta por WhatsApp",
      text: "Te redirigimos con el mensaje listo para coordinar la atención.",
    },
    {
      icon: Clock,
      title: "Atención 24/7",
      text: "Guardia pediátrica y orientación permanente en Corrientes Capital.",
    },
  ];

  return (
    <section id="contacto" className="section-padding bg-surface-soft">
      <div className="section-container">
        <SectionHeading
          eyebrow="Coordinación de atención"
          title="Solicitud de atención"
          description="Completá el formulario con los datos del niño o la niña. Registramos tu solicitud y te ayudamos a contactar a la clínica por WhatsApp."
        />

        <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-medical-teal/20 bg-gradient-to-br from-medical-deep to-medical-blue p-6 text-white shadow-card md:p-8">
              <div className="flex items-center gap-2 text-medical-teal">
                <Shield className="h-5 w-5" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Proceso claro y seguro
                </span>
              </div>
              <p className="mt-4 font-display text-xl font-bold">
                Tu familia, nuestra prioridad institucional
              </p>

              <ul className="mt-6 space-y-4">
                {trustItems.map((item) => (
                  <li key={item.title} className="flex gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                      <item.icon className="h-5 w-5 text-medical-teal" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{item.title}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-white/75">
                        {item.text}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-7">
            {success && (
              <div
                ref={successRef}
                role="status"
                aria-live="polite"
                className="mb-6 rounded-2xl border-2 border-health-green/40 bg-health-green/10 p-5 shadow-soft md:p-6"
              >
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-health-green/20">
                    <CheckCircle2 className="h-7 w-7 text-health-green" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-lg font-bold text-medical-deep">
                      Solicitud registrada correctamente
                    </p>
                    <p className="mt-2 text-sm text-text-muted">
                      Código de solicitud:{" "}
                      <strong className="font-mono text-medical-deep">
                        {success.code}
                      </strong>
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-text-muted">
                      Te redirigimos a WhatsApp para completar el envío del
                      mensaje.
                    </p>
                    {success.whatsappUrl && (
                      <Button
                        variant="whatsapp"
                        size="sm"
                        href={success.whatsappUrl}
                        external
                        className="mt-4 w-full sm:w-auto"
                      >
                        <MessageCircle className="h-4 w-4" />
                        Abrir WhatsApp
                      </Button>
                    )}
                    <button
                      type="button"
                      onClick={handleNewRequest}
                      className="mt-3 block text-sm font-medium text-medical-blue underline-offset-2 hover:underline"
                    >
                      Enviar otra solicitud
                    </button>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div
                role="alert"
                className="mb-6 flex gap-3 rounded-2xl border border-medical-coral/40 bg-medical-coral/10 p-4"
              >
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-medical-coral" />
                <p className="text-sm font-medium text-medical-deep">{error}</p>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className={cn(
                "rounded-3xl border border-medical-blue/10 bg-white p-6 shadow-card md:p-8",
                submitted && "pointer-events-none opacity-60"
              )}
            >
              <p className="font-display text-lg font-semibold text-medical-deep">
                Datos de la solicitud
              </p>
              <p className="mt-1 text-sm text-text-muted">
                Los campos marcados con * son obligatorios.
              </p>

              <fieldset disabled={loading || submitted} className="mt-6 min-w-0">
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    { key: "childName", label: "Nombre del niño/a *", type: "text" },
                    { key: "childAge", label: "Edad *", type: "text" },
                    { key: "guardianName", label: "Adulto responsable *", type: "text" },
                    { key: "guardianPhone", label: "WhatsApp *", type: "tel" },
                  ].map((field) => (
                    <div
                      key={field.key}
                      className={field.key === "guardianName" ? "sm:col-span-2" : ""}
                    >
                      <label className="mb-1.5 block text-sm font-medium text-medical-deep">
                        {field.label}
                      </label>
                      <input
                        required
                        type={field.type}
                        value={form[field.key as keyof typeof form]}
                        onChange={(e) =>
                          setForm({ ...form, [field.key]: e.target.value })
                        }
                        className="input-field"
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <label className="mb-1.5 block text-sm font-medium text-medical-deep">
                    Servicio requerido *
                  </label>
                  <select
                    required
                    value={form.serviceRequested}
                    onChange={(e) =>
                      setForm({ ...form, serviceRequested: e.target.value })
                    }
                    className="input-field"
                  >
                    <option value="">Seleccionar servicio...</option>
                    {services.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-4">
                  <label className="mb-1.5 block text-sm font-medium text-medical-deep">
                    Obra social
                  </label>
                  <input
                    value={form.insuranceProvider}
                    onChange={(e) =>
                      setForm({ ...form, insuranceProvider: e.target.value })
                    }
                    className="input-field"
                    placeholder="Nombre de la obra social, si corresponde"
                  />
                </div>

                <div className="mt-4">
                  <label className="mb-1.5 block text-sm font-medium text-medical-deep">
                    Motivo de consulta *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={form.reason}
                    onChange={(e) => setForm({ ...form, reason: e.target.value })}
                    className="input-field resize-none"
                  />
                </div>

                <div className="mt-4">
                  <label className="mb-1.5 block text-sm font-medium text-medical-deep">
                    Mensaje adicional
                  </label>
                  <textarea
                    rows={2}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="input-field resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="mt-6 w-full"
                  disabled={loading || submitted}
                >
                  {loading
                    ? "Enviando solicitud..."
                    : "Enviar solicitud de atención"}
                </Button>
              </fieldset>
            </form>

            <div className="mt-6 rounded-2xl border border-medical-blue/10 bg-white p-5 shadow-soft">
              <p className="font-display font-semibold text-medical-deep">
                Consultar estado de solicitud
              </p>
              <form onSubmit={checkStatus} className="mt-3 flex flex-col gap-2 sm:flex-row">
                <input
                  placeholder="Ej: CDN-20260601-0001"
                  value={statusCode}
                  onChange={(e) => setStatusCode(e.target.value)}
                  className="input-field flex-1 text-sm"
                  disabled={statusLoading}
                />
                <Button
                  type="submit"
                  variant="outline"
                  size="md"
                  className="shrink-0"
                  disabled={statusLoading}
                >
                  <Search className="h-4 w-4" />
                  {statusLoading ? "Consultando..." : "Consultar"}
                </Button>
              </form>
              {statusError && (
                <p className="mt-3 text-sm text-medical-coral">{statusError}</p>
              )}
              {statusResult && (
                <p className="mt-3 rounded-xl bg-medical-sky/50 px-4 py-3 text-sm text-medical-deep">
                  Estado:{" "}
                  <strong>
                    {statusLabels[statusResult.status] || statusResult.status}
                  </strong>
                  {" · "}
                  Servicio: {statusResult.serviceRequested}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
