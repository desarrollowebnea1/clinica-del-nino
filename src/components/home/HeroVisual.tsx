import {
  Activity,
  Baby,
  Building2,
  Clock,
  HeartPulse,
  Scissors,
  Syringe,
} from "lucide-react";
import Image from "next/image";

const capabilities = [
  { icon: HeartPulse, label: "Guardia activa", accent: "bg-health-green/15 text-health-green" },
  { icon: Building2, label: "Internación", accent: "bg-medical-sky text-medical-blue" },
  { icon: Syringe, label: "Vacunatorio", accent: "bg-medical-teal/15 text-medical-teal" },
  { icon: Baby, label: "Neonatología", accent: "bg-medical-sky text-medical-blue" },
  { icon: Scissors, label: "Cirugías", accent: "bg-medical-coral/15 text-medical-coral" },
  { icon: Activity, label: "Terapia intensiva", accent: "bg-medical-deep/10 text-medical-deep" },
];

export function HeroVisual({
  title,
  heroImageUrl,
}: {
  title: string;
  heroImageUrl?: string | null;
}) {
  return (
    <div className="relative">
      <div className="absolute -inset-4 rounded-4xl bg-gradient-to-br from-medical-teal/20 to-medical-deep/5 blur-2xl" />

      <div className="relative overflow-hidden rounded-3xl border border-white/80 bg-white shadow-float">
        {heroImageUrl ? (
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={heroImageUrl}
              alt={title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-medical-deep/80 via-medical-deep/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p className="font-display text-lg font-bold text-white">
                Clínica pediátrica 24/7
              </p>
              <p className="text-sm text-white/85">Corrientes Capital</p>
            </div>
          </div>
        ) : (
          <div className="relative bg-institutional p-6 pb-8 md:p-8">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-medical-teal/20 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-white/10 blur-2xl" />

            <div className="relative flex items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-medical-teal">
                  Institución médica
                </p>
                <p className="mt-1 font-display text-xl font-bold text-white md:text-2xl">
                  Clínica pediátrica 24/7
                </p>
                <p className="mt-0.5 text-sm text-white/70">Corrientes Capital</p>
              </div>
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-health-green/20 ring-2 ring-health-green/40">
                <Clock className="h-7 w-7 text-health-green" />
              </div>
            </div>

            <div className="relative mt-5 grid grid-cols-2 gap-2.5 sm:gap-3">
              {capabilities.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/10 px-3 py-3 backdrop-blur-sm"
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${item.accent}`}
                  >
                    <item.icon className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-semibold leading-tight text-white sm:text-sm">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="relative mt-5 flex items-center gap-2 rounded-xl bg-health-green/15 px-4 py-3 ring-1 ring-health-green/30">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-health-green opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-health-green" />
              </span>
              <p className="text-sm font-medium text-white">
                Guardia pediátrica permanente
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="absolute -bottom-3 -right-2 hidden rounded-2xl border border-medical-teal/20 bg-white px-4 py-3 shadow-card sm:block md:-right-4">
        <p className="font-display text-2xl font-bold text-medical-deep">24/7</p>
        <p className="text-xs font-medium text-text-muted">365 días del año</p>
      </div>
    </div>
  );
}
