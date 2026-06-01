"use client";

import { InquiryStatusPanel } from "@/components/home/InquiryStatusPanel";
import { SectionHeading } from "@/components/home/SectionHeading";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import {
  LAST_INQUIRY_CODE_KEY,
  type InquiryStatusData,
} from "@/lib/inquiry-status";
import { cn } from "@/lib/utils";
import type { Service } from "@prisma/client";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Hash,
  Search,
  Shield,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

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

export function InquirySection({
  services,
  whatsappNumber,
}: {
  services: Service[];
  whatsappNumber: string;
}) {
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
  const [statusResult, setStatusResult] = useState<InquiryStatusData | null>(null);
  const [lastSavedCode, setLastSavedCode] = useState<string | null>(null);

  const successRef = useRef<HTMLDivElement>(null);
  const statusPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LAST_INQUIRY_CODE_KEY);
      if (saved) {
        setLastSavedCode(saved);
        setStatusCode((prev) => prev || saved);
      }
    } catch {
      /* localStorage no disponible */
    }
  }, []);

  function persistLastCode(code: string) {
    try {
      localStorage.setItem(LAST_INQUIRY_CODE_KEY, code);
      setLastSavedCode(code);
    } catch {
      /* ignore */
    }
  }

  async function fetchStatus(code: string) {
    const res = await fetch(
      `/api/public/inquiries/${encodeURIComponent(code.toUpperCase())}`
    );
    const json = await res.json();

    if (!res.ok || !json.success) {
      throw new Error(json.error || "No encontramos una solicitud con ese código.");
    }

    return json.data as InquiryStatusData;
  }

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

      let json: {
        success?: boolean;
        error?: string;
        data?: { inquiry: { inquiryCode: string }; whatsappUrl: string | null };
      };
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
      persistLastCode(code);

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
    const code = statusCode.trim().toUpperCase();

    if (!code) {
      setStatusError("Ingresá el código de tu solicitud (ej: CDN-20260601-0001).");
      setStatusResult(null);
      return;
    }

    setStatusLoading(true);
    setStatusError(null);
    setStatusResult(null);

    try {
      const data = await fetchStatus(code);
      setStatusResult(data);
      persistLastCode(code);

      requestAnimationFrame(() => {
        statusPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
    } catch (err) {
      setStatusError(
        err instanceof Error
          ? err.message
          : "No encontramos una solicitud con ese código. Verificá e intentá de nuevo."
      );
    } finally {
      setStatusLoading(false);
    }
  }

  async function loadLastInquiry() {
    if (!lastSavedCode) return;
    setStatusCode(lastSavedCode);
    setStatusLoading(true);
    setStatusError(null);
    setStatusResult(null);

    try {
      const data = await fetchStatus(lastSavedCode);
      setStatusResult(data);
      requestAnimationFrame(() => {
        statusPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
    } catch (err) {
      setStatusError(
        err instanceof Error ? err.message : "No pudimos cargar tu última solicitud."
      );
    } finally {
      setStatusLoading(false);
    }
  }

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
      icon: WhatsAppIcon,
      title: "Respuesta por WhatsApp",
      text: "Te redirigimos con el mensaje listo para coordinar la atención.",
      isWhatsApp: true,
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
                      {"isWhatsApp" in item && item.isWhatsApp ? (
                        <WhatsAppIcon size={20} variant="brand" />
                      ) : (
                        <item.icon className="h-5 w-5 text-medical-teal" />
                      )}
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
                      mensaje. Podés consultar el estado con ese código cuando quieras.
                    </p>
                    {success.whatsappUrl && (
                      <Button
                        variant="whatsapp"
                        size="sm"
                        href={success.whatsappUrl}
                        external
                        className="mt-4 w-full sm:w-auto"
                      >
                        <WhatsAppIcon size={18} />
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

            <div className="mt-6 rounded-2xl border border-medical-blue/10 bg-white p-5 shadow-soft md:p-6">
              <p className="font-display text-lg font-semibold text-medical-deep">
                Consultar estado de solicitud
              </p>
              <p className="mt-1 text-sm text-text-muted">
                Ingresá el código CDN que recibiste al enviar la solicitud.
              </p>

              {lastSavedCode && !statusResult && (
                <button
                  type="button"
                  onClick={loadLastInquiry}
                  disabled={statusLoading}
                  className="mt-3 w-full rounded-xl border border-medical-teal/30 bg-medical-sky/40 px-4 py-3 text-left text-sm transition hover:bg-medical-sky/70 disabled:opacity-60"
                >
                  <span className="font-semibold text-medical-deep">
                    Tu última solicitud
                  </span>
                  <span className="mt-0.5 block font-mono text-medical-teal">
                    {lastSavedCode}
                  </span>
                  <span className="mt-1 text-xs text-text-muted">
                    Tocá para ver el estado actual
                  </span>
                </button>
              )}

              <form onSubmit={checkStatus} className="mt-4 flex flex-col gap-2 sm:flex-row">
                <input
                  placeholder="Ej: CDN-20260601-0001"
                  value={statusCode}
                  onChange={(e) => setStatusCode(e.target.value.toUpperCase())}
                  className="input-field flex-1 font-mono text-sm uppercase"
                  disabled={statusLoading}
                  aria-invalid={!!statusError}
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="shrink-0"
                  disabled={statusLoading}
                >
                  <Search className="h-4 w-4" />
                  {statusLoading ? "Consultando..." : "Consultar"}
                </Button>
              </form>

              {statusError && (
                <div
                  role="alert"
                  className="mt-4 flex gap-2 rounded-xl border border-medical-coral/30 bg-medical-coral/10 px-4 py-3 text-sm text-medical-deep"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-medical-coral" />
                  {statusError}
                </div>
              )}

              <div ref={statusPanelRef}>
                {statusResult && (
                  <InquiryStatusPanel
                    inquiry={statusResult}
                    whatsappNumber={whatsappNumber}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
