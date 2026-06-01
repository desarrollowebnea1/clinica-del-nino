"use client";

import { Card } from "@/components/ui/Card";
import { useEffect, useState } from "react";

type DashboardData = {
  todayCount: number;
  pendingCount: number;
  contactedCount: number;
  resolvedCount: number;
  activeServices: number;
  activeInsurance: number;
  recentInquiries: Array<{
    id: string;
    inquiryCode: string;
    childName: string;
    guardianName: string;
    status: string;
    createdAt: string;
  }>;
};

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setData(json.data);
      });
  }, []);

  const stats = [
    { label: "Solicitudes hoy", value: data?.todayCount ?? "—" },
    { label: "Pendientes", value: data?.pendingCount ?? "—" },
    { label: "Contactadas", value: data?.contactedCount ?? "—" },
    { label: "Resueltas", value: data?.resolvedCount ?? "—" },
    { label: "Servicios activos", value: data?.activeServices ?? "—" },
    { label: "Obras sociales", value: data?.activeInsurance ?? "—" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-medical-blue">Dashboard</h1>
      <p className="mt-1 text-text-muted">Resumen de actividad de la clínica</p>

      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} padding="md">
            <p className="text-2xl font-bold text-medical-blue">{stat.value}</p>
            <p className="mt-1 text-xs text-text-muted">{stat.label}</p>
          </Card>
        ))}
      </div>

      <h2 className="mt-8 font-display text-lg font-semibold text-medical-blue">
        Últimas solicitudes
      </h2>
      <div className="mt-4 space-y-3">
        {data?.recentInquiries?.map((inquiry) => (
          <Card key={inquiry.id} padding="sm" className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium text-medical-blue">{inquiry.inquiryCode}</p>
              <p className="text-sm text-text-muted">
                {inquiry.childName} · {inquiry.guardianName}
              </p>
            </div>
            <span className="inline-flex w-fit rounded-full bg-medical-sky px-3 py-1 text-xs font-medium text-medical-blue">
              {inquiry.status}
            </span>
          </Card>
        )) ?? (
          <p className="text-sm text-text-muted">Cargando...</p>
        )}
      </div>
    </div>
  );
}
