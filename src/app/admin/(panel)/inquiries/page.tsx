"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { buildAdminReplyMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import { MessageCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type Inquiry = {
  id: string;
  inquiryCode: string;
  childName: string;
  childAge: string;
  guardianName: string;
  guardianPhone: string;
  serviceRequested: string;
  insuranceProvider: string | null;
  reason: string;
  status: string;
  createdAt: string;
};

const STATUSES = ["NUEVA", "CONTACTADA", "EN_SEGUIMIENTO", "RESUELTA", "CANCELADA"];

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");

  const load = useCallback(async () => {
    const params = new URLSearchParams();
    if (filter) params.set("status", filter);
    if (search) params.set("q", search);
    const res = await fetch(`/api/admin/inquiries?${params}`);
    const json = await res.json();
    if (json.success) setInquiries(json.data);
  }, [filter, search]);

  useEffect(() => {
    load();
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setWhatsappNumber(json.data?.whatsappNumber || "");
      });
  }, [load]);

  async function updateStatus(id: string, status: string) {
    await fetch("/api/admin/inquiries", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    load();
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-medical-blue">Solicitudes</h1>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-xl border border-medical-blue/10 px-4 py-3"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-xl border border-medical-blue/10 px-4 py-3"
        >
          <option value="">Todos los estados</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <Button variant="outline" onClick={load}>
          Buscar
        </Button>
      </div>

      <div className="mt-6 space-y-4">
        {inquiries.map((inquiry) => {
          const replyUrl = whatsappNumber
            ? buildWhatsAppUrl(
                inquiry.guardianPhone || whatsappNumber,
                buildAdminReplyMessage(inquiry.guardianName, inquiry.inquiryCode)
              )
            : "#";

          return (
            <Card key={inquiry.id} padding="md">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="font-display font-bold text-medical-blue">
                    {inquiry.inquiryCode}
                  </p>
                  <p className="text-sm text-text-muted">
                    {new Date(inquiry.createdAt).toLocaleString("es-AR")}
                  </p>
                  <p className="mt-2 text-sm">
                    <strong>{inquiry.childName}</strong> ({inquiry.childAge}) ·{" "}
                    {inquiry.guardianName}
                  </p>
                  <p className="text-sm text-text-muted">
                    {inquiry.guardianPhone} · {inquiry.serviceRequested}
                  </p>
                  {inquiry.insuranceProvider && (
                    <p className="text-sm">Obra social: {inquiry.insuranceProvider}</p>
                  )}
                  <p className="mt-2 text-sm">{inquiry.reason}</p>
                </div>

                <div className="flex flex-col gap-2 sm:items-end">
                  <select
                    value={inquiry.status}
                    onChange={(e) => updateStatus(inquiry.id, e.target.value)}
                    className="rounded-xl border border-medical-blue/10 px-3 py-2 text-sm"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <Button variant="whatsapp" size="sm" href={replyUrl} external>
                    <MessageCircle className="h-4 w-4" />
                    Responder por WhatsApp
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
