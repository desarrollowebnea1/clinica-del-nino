"use client";

import { useSettings, useWhatsAppUrl } from "@/components/providers/SettingsProvider";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { MapPin } from "lucide-react";
import Link from "next/link";

const footerLinks = [
  { href: "#servicios", label: "Servicios" },
  { href: "#guardia", label: "Guardia 24/7" },
  { href: "#vacunatorio", label: "Vacunatorio" },
  { href: "#neonatologia", label: "Neonatología y UTI" },
  { href: "#obras-sociales", label: "Obras sociales" },
  { href: "#contacto", label: "Solicitud de atención" },
  { href: "#ubicacion", label: "Ubicación" },
  { href: "#faq", label: "Preguntas frecuentes" },
];

export function Footer() {
  const settings = useSettings();
  const waUrl = useWhatsAppUrl();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-medical-deep text-white">
      <div className="border-b border-white/10 bg-medical-blue/50">
        <div className="section-container flex flex-col items-center justify-between gap-4 py-6 text-center md:flex-row md:text-left">
          <div>
            <p className="font-display text-lg font-bold">
              ¿Necesitás atención pediátrica ahora?
            </p>
            <p className="mt-1 text-sm text-white/75">
              Guardia 24 horas · Corrientes Capital
            </p>
          </div>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-2xl bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-white shadow-soft transition hover:bg-[#20BD5A]"
          >
            <WhatsAppIcon size={22} />
            WhatsApp 24 hs
          </a>
        </div>
      </div>

      <div className="section-container section-padding pb-10 pt-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <p className="font-display text-2xl font-bold">{settings.clinicName}</p>
            <p className="mt-2 text-medical-teal">{settings.slogan}</p>
            <p className="mt-4 flex items-start gap-2 text-sm text-white/75">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-medical-teal" />
              <span>
                {settings.address}
                <br />
                <span className="text-white/55">Corrientes Capital, Argentina</span>
              </span>
            </p>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/60">
              Institución pediátrica con guardia permanente, internación, vacunatorio,
              neonatología, terapia intensiva y estudios complementarios.
            </p>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-medical-teal">
              Contacto
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-medium text-white hover:text-medical-teal"
                >
                  <WhatsAppIcon size={18} />
                  WhatsApp 24 hs
                </a>
              </li>
              {settings.phone && (
                <li className="text-white/75">{settings.phone}</li>
              )}
              {settings.email && (
                <li>
                  <a
                    href={`mailto:${settings.email}`}
                    className="text-white/75 hover:text-medical-teal"
                  >
                    {settings.email}
                  </a>
                </li>
              )}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-medical-teal">
              Enlaces
            </h3>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/75 transition hover:text-medical-teal"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 space-y-4 border-t border-white/10 pt-8">
          <p className="text-xs leading-relaxed text-white/55">
            {settings.legalNotice}
          </p>
          <div className="flex flex-col gap-2 text-xs text-white/45 sm:flex-row sm:justify-between">
            <p>
              © {year} {settings.clinicName}. Todos los derechos reservados.
            </p>
            <p>Atención pediátrica institucional · Corrientes Capital</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
