import { Button } from "@/components/ui/Button";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import {
  AlertTriangle,
  CheckCircle2,
  MessageCircle,
  Stethoscope,
} from "lucide-react";

export function GuardiaSection({
  title,
  description,
  items,
  emergencyNotice,
  whatsappNumber,
}: {
  title: string;
  description: string;
  items: string[];
  emergencyNotice: string;
  whatsappNumber: string;
}) {
  const waUrl = buildWhatsAppUrl(
    whatsappNumber,
    "Hola Clínica del Niño, necesito consultar por la guardia pediátrica."
  );

  return (
    <section id="guardia" className="section-padding relative overflow-hidden bg-institutional text-white">
      <div className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-medical-teal/15 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-white/5 blur-3xl" />

      <div className="section-container relative">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-12">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full bg-health-green/20 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-health-green ring-1 ring-health-green/30">
              <Stethoscope className="h-3.5 w-3.5" />
              Servicio estrella
            </div>

            <h2 className="mt-5 font-display text-3xl font-bold leading-tight text-white md:text-4xl lg:text-[2.75rem]">
              Guardia pediátrica disponible las 24 horas
            </h2>
            <p className="mt-3 font-display text-lg font-medium text-medical-teal md:text-xl">
              Atención en consultorio todos los días del año.
            </p>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-white/75">
              {description}
            </p>

            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {items.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-medical-teal" />
                  <span className="text-sm font-medium text-white/95">{item}</span>
                </li>
              ))}
            </ul>

            <Button variant="whatsapp" size="lg" href={waUrl} external className="mt-8">
              <MessageCircle className="h-5 w-5" />
              WhatsApp 24 hs
            </Button>
          </div>

          <div className="lg:col-span-5">
            <div className="overflow-hidden rounded-2xl border border-medical-coral/30 bg-gradient-to-br from-medical-coral/20 to-white/5 p-6 shadow-float backdrop-blur-sm md:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-medical-coral/25">
                  <AlertTriangle className="h-6 w-6 text-medical-coral" />
                </div>
                <div>
                  <p className="font-display text-lg font-bold text-white">
                    Ante una emergencia grave
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-white/85">
                    {emergencyNotice}
                  </p>
                  <p className="mt-4 text-xs font-medium text-white/60">
                    Servicio de emergencias: 107
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-medical-teal">
                Corrientes Capital
              </p>
              <p className="mt-2 font-display text-xl font-bold text-white">
                {title}
              </p>
              <p className="mt-1 text-sm text-white/70">
                Consultorio pediátrico sin turno previo para urgencias de guardia.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
