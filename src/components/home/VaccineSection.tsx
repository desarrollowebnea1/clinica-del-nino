import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/home/SectionHeading";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import type { VaccineContent } from "@prisma/client";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { Calendar, FileText, Shield, Syringe } from "lucide-react";

export function VaccineSection({
  vaccine,
  whatsappNumber,
}: {
  vaccine: VaccineContent;
  whatsappNumber: string;
}) {
  const waUrl = buildWhatsAppUrl(
    whatsappNumber,
    "Hola Clínica del Niño, quiero consultar por el vacunatorio."
  );

  const items = [
    {
      icon: Syringe,
      title: "Calendario Nacional",
      text: vaccine.calendarVaccines,
      accent: "border-health-green/20 bg-health-green/5",
    },
    {
      icon: Syringe,
      title: "Inyectables indicados",
      text: vaccine.injectablesInfo,
      accent: "border-medical-teal/20 bg-medical-teal/5",
    },
    {
      icon: FileText,
      title: "Documentación a llevar",
      text: vaccine.requirements,
      accent: "border-medical-blue/10 bg-white",
    },
    {
      icon: Calendar,
      title: "Horarios",
      text: vaccine.schedules,
      accent: "border-medical-blue/10 bg-white",
    },
  ];

  return (
    <section id="vacunatorio" className="section-padding relative overflow-hidden bg-vaccine-soft">
      <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-health-green/10 blur-3xl" />

      <div className="section-container relative">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-14">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-health-green/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-health-green">
              <Shield className="h-3.5 w-3.5" />
              Prevención y calendario oficial
            </div>
            <SectionHeading
              title={vaccine.title}
              description={vaccine.description}
              align="left"
              className="mt-4 [&_h2]:text-left"
            />
            <Button variant="whatsapp" size="lg" href={waUrl} external className="mt-6">
              <WhatsAppIcon size={22} />
              Consultar vacunatorio
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
            {items.map((item) => (
              <div
                key={item.title}
                className={`rounded-2xl border p-5 shadow-soft ${item.accent}`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-soft">
                  <item.icon className="h-5 w-5 text-medical-teal" />
                </div>
                <p className="mt-3 font-display text-sm font-bold text-medical-deep">
                  {item.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
