"use client";

import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import {
  getInquiryStatusConfig,
  type InquiryStatusData,
} from "@/lib/inquiry-status";
import { buildInquiryStatusWhatsAppMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import { Calendar, ClipboardList, Hash } from "lucide-react";

export function InquiryStatusPanel({
  inquiry,
  whatsappNumber,
}: {
  inquiry: InquiryStatusData;
  whatsappNumber: string;
}) {
  const config = getInquiryStatusConfig(inquiry.status);
  const created = new Date(inquiry.createdAt);
  const updated = new Date(inquiry.updatedAt);
  const showUpdated = updated.getTime() - created.getTime() > 1000;

  const waUrl =
    whatsappNumber &&
    buildWhatsAppUrl(
      whatsappNumber,
      buildInquiryStatusWhatsAppMessage(inquiry.inquiryCode)
    );

  return (
    <div
      role="status"
      aria-live="polite"
      className="mt-4 overflow-hidden rounded-2xl border border-medical-blue/15 bg-white shadow-card"
    >
      <div className="border-b border-medical-blue/10 bg-gradient-to-r from-medical-sky/60 to-white px-5 py-4 md:px-6">
        <p className="text-xs font-bold uppercase tracking-wider text-medical-teal">
          Estado de tu solicitud
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 font-mono text-lg font-bold text-medical-deep">
            <Hash className="h-5 w-5 text-medical-teal" aria-hidden />
            {inquiry.inquiryCode}
          </div>
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ring-1 ${config.badgeClass}`}
          >
            {config.label}
          </span>
        </div>
      </div>

      <div className="space-y-4 px-5 py-5 md:px-6">
        <p className="text-sm leading-relaxed text-text-muted">{config.message}</p>

        <dl className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-medical-sky/40 px-4 py-3">
            <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-medical-teal">
              <ClipboardList className="h-3.5 w-3.5" aria-hidden />
              Servicio solicitado
            </dt>
            <dd className="mt-1 text-sm font-medium text-medical-deep">
              {inquiry.serviceRequested}
            </dd>
          </div>
          <div className="rounded-xl bg-medical-sky/40 px-4 py-3">
            <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-medical-teal">
              <Calendar className="h-3.5 w-3.5" aria-hidden />
              Fecha de registro
            </dt>
            <dd className="mt-1 text-sm font-medium text-medical-deep">
              {created.toLocaleString("es-AR", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </dd>
          </div>
          {showUpdated && (
            <div className="rounded-xl bg-medical-sky/40 px-4 py-3 sm:col-span-2">
              <dt className="text-xs font-semibold uppercase tracking-wide text-medical-teal">
                Última actualización
              </dt>
              <dd className="mt-1 text-sm font-medium text-medical-deep">
                {updated.toLocaleString("es-AR", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </dd>
            </div>
          )}
        </dl>

        {waUrl && (
          <Button variant="whatsapp" size="lg" href={waUrl} external className="w-full">
            <WhatsAppIcon size={22} />
            Consultar por WhatsApp
          </Button>
        )}
      </div>
    </div>
  );
}
