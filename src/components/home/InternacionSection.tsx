import { SectionHeading } from "@/components/home/SectionHeading";
import {
  Activity,
  Building2,
  HeartHandshake,
  Scissors,
} from "lucide-react";

const cards = [
  {
    icon: Building2,
    title: "Internación clínica pediátrica",
    description:
      "Hospitalización con seguimiento médico continuo y cuidados en entorno pediátrico institucional.",
  },
  {
    icon: Scissors,
    title: "Internación quirúrgica",
    description:
      "Acompañamiento durante el proceso quirúrgico y la estadía hospitalaria del niño o la niña.",
  },
  {
    icon: Activity,
    title: "Seguimiento médico",
    description:
      "Control evolutivo y coordinación con el equipo de salud durante toda la internación.",
  },
  {
    icon: HeartHandshake,
    title: "Cuidados postoperatorios",
    description:
      "Atención posterior a procedimientos quirúrgicos con enfoque en recuperación segura.",
  },
];

export function InternacionSection({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section id="internacion" className="section-padding bg-surface-soft">
      <div className="section-container">
        <SectionHeading
          eyebrow="Hospitalización pediátrica"
          title={title}
          description={description}
          align="left"
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {cards.map((card) => (
            <div
              key={card.title}
              className="flex flex-col rounded-2xl border border-medical-blue/10 bg-white p-6 shadow-soft transition hover:border-medical-teal/25 hover:shadow-card"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-medical-deep text-white">
                <card.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-base font-bold text-medical-deep">
                {card.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-text-muted">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
