import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/home/SectionHeading";
import { FEATURED_SERVICE_SLUGS, SERVICE_VALUE_COPY } from "@/lib/constants/colors";
import { getServiceIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import type { Service } from "@prisma/client";
import Image from "next/image";
import { ArrowUpRight, MessageCircle } from "lucide-react";

export function ServicesSection({
  services,
  whatsappNumber,
}: {
  services: Service[];
  whatsappNumber: string;
}) {
  const sorted = [...services].sort((a, b) => {
    const aFeatured = FEATURED_SERVICE_SLUGS.has(a.slug) ? 0 : 1;
    const bFeatured = FEATURED_SERVICE_SLUGS.has(b.slug) ? 0 : 1;
    if (aFeatured !== bFeatured) return aFeatured - bFeatured;
    return a.sortOrder - b.sortOrder;
  });

  return (
    <section id="servicios" className="section-padding bg-warm-white">
      <div className="section-container">
        <SectionHeading
          eyebrow="Áreas médicas"
          title="Servicios principales"
          description="Atención pediátrica integral en un mismo centro: guardia permanente, internación, vacunatorio, cuidados intensivos y estudios complementarios."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {sorted.map((service) => {
            const Icon = getServiceIcon(service.icon);
            const isFeatured =
              service.featured || FEATURED_SERVICE_SLUGS.has(service.slug);
            const valueCopy =
              SERVICE_VALUE_COPY[service.slug] || service.shortDescription;
            const waUrl = buildWhatsAppUrl(
              whatsappNumber,
              `Hola Clínica del Niño, quiero consultar por: ${service.name}`
            );

            return (
              <article
                key={service.id}
                className={cn(
                  "group flex flex-col overflow-hidden rounded-2xl border bg-white shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-card",
                  isFeatured
                    ? "border-medical-teal/25 ring-1 ring-medical-teal/10 lg:col-span-1"
                    : "border-medical-blue/10"
                )}
              >
                {service.imageUrl ? (
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={service.imageUrl}
                      alt={service.name}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-medical-deep/50 to-transparent" />
                  </div>
                ) : (
                  <div
                    className={cn(
                      "flex items-center gap-4 border-b border-medical-blue/5 p-5",
                      isFeatured ? "bg-gradient-to-br from-medical-sky to-white" : "bg-surface-soft/50"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-inner-soft",
                        isFeatured
                          ? "bg-medical-deep text-white"
                          : "bg-white text-medical-teal ring-1 ring-medical-blue/10"
                      )}
                    >
                      <Icon className="h-7 w-7" />
                    </div>
                    {isFeatured && (
                      <span className="rounded-full bg-health-green/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-health-green">
                        Servicio clave
                      </span>
                    )}
                  </div>
                )}

                <div className="flex flex-1 flex-col p-5 md:p-6">
                  <h3 className="font-display text-lg font-bold text-medical-deep md:text-xl">
                    {service.name}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-text-muted">
                    {valueCopy}
                  </p>

                  <Button
                    variant={isFeatured ? "primary" : "outline"}
                    size="sm"
                    href={waUrl}
                    external
                    className="mt-5 w-full"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Consultar por este servicio
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-60" />
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
