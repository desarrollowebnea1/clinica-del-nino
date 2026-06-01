"use client";

import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/home/SectionHeading";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import type { InsuranceProvider } from "@prisma/client";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { Info, Search, Shield } from "lucide-react";
import { useMemo, useState } from "react";

export function InsuranceSection({
  providers,
  whatsappNumber,
}: {
  providers: InsuranceProvider[];
  whatsappNumber: string;
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return providers;
    return providers.filter((p) => p.name.toLowerCase().includes(q));
  }, [providers, query]);

  const waUrl = buildWhatsAppUrl(
    whatsappNumber,
    "Hola Clínica del Niño, quiero consultar cobertura y requisitos de mi obra social."
  );

  return (
    <section id="obras-sociales" className="section-padding bg-warm-white">
      <div className="section-container">
        <div className="overflow-hidden rounded-3xl border border-medical-blue/10 bg-gradient-to-br from-medical-sky/60 via-white to-medical-sky/30 p-6 shadow-soft md:p-10 lg:p-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-xl">
              <SectionHeading
                eyebrow="Cobertura médica"
                title="Más de 80 obras sociales activas"
                description="Consultá cobertura y requisitos administrativos antes de tu visita. Nuestro equipo te orienta por WhatsApp."
                align="left"
              />
              <div className="mt-6 flex items-start gap-3 rounded-xl border border-medical-blue/10 bg-white/80 p-4">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-medical-teal" />
                <p className="text-sm leading-relaxed text-text-muted">
                  La cobertura puede variar según plan y prestación. Confirmá
                  siempre con la clínica antes de concurrir.
                </p>
              </div>
            </div>

            <div className="flex shrink-0 flex-col items-stretch gap-3 sm:items-end">
              <div className="flex items-center gap-3 rounded-2xl bg-medical-deep px-5 py-4 text-white">
                <Shield className="h-8 w-8 text-medical-teal" />
                <div>
                  <p className="font-display text-2xl font-bold">{providers.length}+</p>
                  <p className="text-xs text-white/70">en nuestra base actual</p>
                </div>
              </div>
              <Button variant="whatsapp" size="lg" href={waUrl} external className="w-full sm:w-auto">
                <WhatsAppIcon size={22} />
                Consultar cobertura por WhatsApp
              </Button>
            </div>
          </div>

          <div className="relative mt-8">
            <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />
            <input
              type="search"
              placeholder="Buscar obra social por nombre..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="input-field pl-14 text-base shadow-soft"
            />
          </div>

          <div className="mt-6 flex max-h-[280px] flex-wrap gap-2 overflow-y-auto pr-1 sm:max-h-[320px]">
            {filtered.map((provider) => (
              <span key={provider.id} className="chip-insurance">
                {provider.name}
              </span>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="mt-6 rounded-xl bg-white/80 px-4 py-3 text-center text-sm text-text-muted">
              No encontramos esa obra social en el listado. Escribinos por WhatsApp
              y te confirmamos la cobertura.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
