import {
  Building2,
  Calendar,
  Clock,
  HeartPulse,
  Shield,
  Syringe,
} from "lucide-react";

const metrics = [
  { icon: Clock, value: "24 hs", label: "Atención continua" },
  { icon: Calendar, value: "365", label: "Días del año" },
  { icon: HeartPulse, value: "Guardia", label: "Pediátrica permanente" },
  { icon: Building2, value: "Internación", label: "Clínica y quirúrgica" },
  { icon: Syringe, value: "Vacunatorio", label: "Calendario nacional" },
  { icon: Shield, value: "+80", label: "Obras sociales" },
];

export function TrustBar() {
  return (
    <section className="bg-trust-strip py-0 text-white shadow-card">
      <div className="section-container">
        <div className="grid grid-cols-2 divide-white/10 sm:grid-cols-3 lg:grid-cols-6 lg:divide-x">
          {metrics.map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center justify-center gap-2 border-white/10 px-3 py-6 text-center sm:px-4 md:py-8 [&:not(:last-child)]:border-b sm:[&:nth-child(odd)]:border-r lg:border-b-0"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
                <item.icon className="h-5 w-5 text-medical-teal" />
              </div>
              <p className="font-display text-lg font-bold leading-none md:text-xl">
                {item.value}
              </p>
              <p className="text-[11px] font-medium uppercase tracking-wide text-white/70 sm:text-xs">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
