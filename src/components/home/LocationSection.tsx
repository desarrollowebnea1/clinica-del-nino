import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { SectionHeading } from "@/components/home/SectionHeading";
import { sanitizeGoogleMapsEmbedUrl } from "@/lib/maps-embed";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { Clock, MapPin, Navigation } from "lucide-react";

export function LocationSection({
  address,
  mapsUrl,
  mapsEmbedUrl,
  openingHours,
  whatsappNumber,
}: {
  address: string;
  mapsUrl?: string | null;
  mapsEmbedUrl?: string | null;
  openingHours: Record<string, string>;
  whatsappNumber: string;
}) {
  const embedSrc = sanitizeGoogleMapsEmbedUrl(mapsEmbedUrl);
  const waUrl = buildWhatsAppUrl(
    whatsappNumber,
    "Hola Clínica del Niño, quiero consultar la ubicación y cómo llegar."
  );

  const hourLabels: Record<string, string> = {
    guardia: "Guardia pediátrica",
    consultorio: "Consultorio",
    vacunatorio: "Vacunatorio",
  };

  return (
    <section id="ubicacion" className="section-padding bg-warm-white">
      <div className="section-container">
        <SectionHeading
          eyebrow="Corrientes Capital"
          title="Ubicación y horarios"
          description="Encontranos en Corrientes Capital. Consultá horarios específicos por WhatsApp si tenés dudas."
        />

        <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:gap-10">
          <div className="rounded-3xl border border-medical-blue/10 bg-white p-6 shadow-soft md:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-medical-sky">
                <MapPin className="h-6 w-6 text-medical-deep" />
              </div>
              <div>
                <p className="font-display font-bold text-medical-deep">Dirección</p>
                <p className="mt-1 text-text-muted">{address}</p>
                <p className="mt-1 text-sm font-medium text-medical-teal">
                  Corrientes Capital, Argentina
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-start gap-4 border-t border-medical-blue/5 pt-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-medical-sky">
                <Clock className="h-6 w-6 text-medical-deep" />
              </div>
              <div>
                <p className="font-display font-bold text-medical-deep">Horarios</p>
                <ul className="mt-2 space-y-2">
                  {Object.entries(openingHours).map(([key, value]) => (
                    <li
                      key={key}
                      className="flex justify-between gap-4 text-sm"
                    >
                      <span className="font-medium text-medical-deep">
                        {hourLabels[key] || key}
                      </span>
                      <span className="text-text-muted">{value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 border-t border-medical-blue/5 pt-6 sm:flex-row">
              {mapsUrl && (
                <Button variant="primary" href={mapsUrl} external className="flex-1">
                  <Navigation className="h-4 w-4" />
                  Cómo llegar
                </Button>
              )}
              <Button variant="whatsapp" href={waUrl} external className="flex-1">
                <WhatsAppIcon size={18} />
                Consultar por WhatsApp
              </Button>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-medical-blue/10 shadow-card">
            {embedSrc ? (
              <iframe
                src={embedSrc}
                className="h-full min-h-[360px] w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                title="Ubicación Clínica del Niño en Corrientes Capital"
              />
            ) : (
              <div className="flex min-h-[360px] flex-col items-center justify-center bg-gradient-to-br from-medical-sky to-surface-soft p-8 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-soft">
                  <MapPin className="h-8 w-8 text-medical-teal" />
                </div>
                <p className="mt-5 font-display text-lg font-bold text-medical-deep">
                  Ver ubicación en Google Maps
                </p>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-text-muted">
                  Abrí el mapa para ver la dirección exacta en Corrientes Capital o
                  escribinos por WhatsApp para orientarte.
                </p>
                {mapsUrl ? (
                  <Button variant="primary" href={mapsUrl} external className="mt-6">
                    <Navigation className="h-4 w-4" />
                    Abrir en Google Maps
                  </Button>
                ) : (
                  <Button variant="whatsapp" href={waUrl} external className="mt-6">
                    <WhatsAppIcon size={18} />
                    Consultar ubicación por WhatsApp
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
