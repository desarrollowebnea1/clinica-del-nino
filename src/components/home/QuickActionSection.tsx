"use client";

import { useWhatsAppUrl } from "@/components/providers/SettingsProvider";
import { Button } from "@/components/ui/Button";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { ArrowRight, HeartPulse, MessageCircle, Users } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: MessageCircle,
    title: "Escribinos por WhatsApp",
    description:
      "Consultá guardia, internación, vacunatorio u obras sociales. Te orientamos sobre el mejor camino.",
    action: "whatsapp" as const,
  },
  {
    step: "02",
    icon: HeartPulse,
    title: "Acercate a la guardia pediátrica",
    description:
      "Atención en consultorio las 24 horas, todos los días del año, en Corrientes Capital.",
    action: "guardia" as const,
  },
  {
    step: "03",
    icon: Users,
    title: "Nuestro equipo orienta la atención",
    description:
      "Evaluación pediátrica, diagnóstico inicial y derivación a estudios si corresponde.",
    action: null,
  },
];

export function QuickActionSection({ whatsappNumber }: { whatsappNumber: string }) {
  const waUrl = useWhatsAppUrl();
  const guardiaWa = buildWhatsAppUrl(
    whatsappNumber,
    "Hola Clínica del Niño, necesito orientación sobre la guardia pediátrica."
  );

  return (
    <section className="section-padding-tight relative -mt-2 border-y border-medical-blue/5 bg-white">
      <div className="section-container">
        <div className="mb-8 text-center md:mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-medical-teal">
            Atención inmediata
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold text-medical-deep md:text-3xl">
            ¿Qué hacer si necesitás atención ahora?
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3 md:gap-6">
          {steps.map((item, index) => (
            <div
              key={item.step}
              className="group relative flex flex-col rounded-2xl border border-medical-blue/10 bg-surface-soft/80 p-6 shadow-soft transition hover:border-medical-teal/30 hover:shadow-card"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-medical-deep text-white shadow-soft">
                  <item.icon className="h-6 w-6" />
                </div>
                <span className="font-display text-3xl font-bold text-medical-blue/10">
                  {item.step}
                </span>
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-medical-deep">
                {item.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-text-muted">
                {item.description}
              </p>
              {item.action === "whatsapp" && (
                <Button
                  variant="whatsapp"
                  size="sm"
                  href={waUrl}
                  external
                  className="mt-5 w-full sm:w-auto"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp 24 hs
                </Button>
              )}
              {item.action === "guardia" && (
                <Button
                  variant="outline"
                  size="sm"
                  href={guardiaWa}
                  external
                  className="mt-5 w-full sm:w-auto"
                >
                  Consultar guardia
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
              {index < steps.length - 1 && (
                <ArrowRight className="absolute -right-3 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-medical-teal/40 md:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
