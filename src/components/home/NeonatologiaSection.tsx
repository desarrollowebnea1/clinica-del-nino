import { SectionHeading } from "@/components/home/SectionHeading";
import { Activity, Baby } from "lucide-react";

export function NeonatologiaSection({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section id="neonatologia" className="section-padding border-y border-medical-blue/5 bg-warm-white">
      <div className="section-container">
        <SectionHeading
          eyebrow="Cuidados especializados"
          title={title}
          description={description}
        />

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="overflow-hidden rounded-3xl border border-medical-blue/10 bg-gradient-to-br from-medical-sky to-white p-8 shadow-soft">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-medical-deep text-white">
              <Baby className="h-7 w-7" />
            </div>
            <h3 className="mt-5 font-display text-xl font-bold text-medical-deep">
              Neonatología
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-text-muted">
              Área institucional de atención para recién nacidos, con equipo
              especializado y protocolos pediátricos. La orientación específica se
              brinda según cada situación clínica.
            </p>
          </div>

          <div className="overflow-hidden rounded-3xl border border-medical-deep/10 bg-medical-deep p-8 text-white shadow-card">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-medical-teal/20 text-medical-teal">
              <Activity className="h-7 w-7" />
            </div>
            <h3 className="mt-5 font-display text-xl font-bold">
              Unidad de terapia intensiva pediátrica
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-white/80">
              Cuidados intensivos pediátricos en un entorno hospitalario
              preparado para situaciones que requieren monitoreo y tratamiento
              continuo. Consultá por WhatsApp para orientación institucional.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
