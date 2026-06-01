import { ClinicLogo } from "@/components/brand/ClinicLogo";
import { Button } from "@/components/ui/Button";
import { HeroVisual } from "@/components/home/HeroVisual";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import {
  Calendar,
  Clock,
  MapPin,
  Shield,
  Stethoscope,
  Syringe,
} from "lucide-react";

const DEFAULT_DESCRIPTION =
  "Guardia pediátrica permanente, internación clínica y quirúrgica, vacunatorio, neonatología, terapia intensiva, laboratorio y rayos X en Corrientes Capital.";

const badges = [
  { icon: Clock, label: "Guardia 24/7" },
  { icon: Calendar, label: "365 días" },
  { icon: Shield, label: "+80 obras sociales" },
  { icon: Syringe, label: "Vacunatorio" },
];

export function Hero({
  title,
  subtitle,
  description,
  heroImageUrl,
  whatsappNumber,
  mapsUrl,
}: {
  title: string;
  subtitle: string;
  description: string;
  heroImageUrl?: string | null;
  whatsappNumber: string;
  mapsUrl?: string | null;
}) {
  const waUrl = buildWhatsAppUrl(whatsappNumber);
  const bodyText = description?.trim() || DEFAULT_DESCRIPTION;

  return (
    <section className="gradient-hero relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 30%, rgba(94, 200, 181, 0.15) 0%, transparent 45%),
            radial-gradient(circle at 85% 70%, rgba(11, 53, 88, 0.06) 0%, transparent 40%)`,
        }}
      />

      <div className="section-container relative pt-24 pb-12 md:pt-28 md:pb-16 lg:pb-20">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-16">
          <div className="animate-fade-in">
            <div className="inline-flex flex-wrap items-center gap-3 rounded-2xl border border-medical-deep/10 bg-white/90 px-3 py-2 shadow-soft sm:gap-4 sm:px-4">
              <ClinicLogo variant="mark" className="h-8 w-8 shrink-0 opacity-95" />
              <p className="text-xs font-bold uppercase tracking-wider text-medical-blue">
                <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-health-green align-middle" />
                Corrientes Capital · Pediatría institucional
              </p>
            </div>

            <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-medical-deep sm:text-5xl lg:text-[3.25rem]">
              {title}
            </h1>

            <p className="mt-4 font-display text-xl font-semibold leading-snug text-medical-teal sm:text-2xl">
              {subtitle}
            </p>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-text-muted md:text-lg">
              {bodyText}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {badges.map((badge) => (
                <span key={badge.label} className="badge-pill">
                  <badge.icon className="h-3.5 w-3.5 text-medical-teal" />
                  {badge.label}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button variant="whatsapp" size="lg" href={waUrl} external className="sm:min-w-[200px]">
                <WhatsAppIcon size={22} />
                WhatsApp 24 hs
              </Button>
              <Button
                variant="outline"
                size="lg"
                href={mapsUrl || "#ubicacion"}
                external={!!mapsUrl}
              >
                <MapPin className="h-5 w-5" />
                Cómo llegar
              </Button>
              <Button variant="primary" size="lg" href="#servicios">
                <Stethoscope className="h-5 w-5" />
                Ver servicios
              </Button>
            </div>
          </div>

          <div className="animate-slide-up animate-delay-200 lg:pl-2">
            <HeroVisual title={title} heroImageUrl={heroImageUrl} />
          </div>
        </div>
      </div>
    </section>
  );
}
