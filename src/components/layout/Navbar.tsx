"use client";

import { Button } from "@/components/ui/Button";
import { useSettings, useWhatsAppUrl } from "@/components/providers/SettingsProvider";
import { cn } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { Clock, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const navLinks = [
  { href: "#servicios", label: "Servicios" },
  { href: "#guardia", label: "Guardia 24/7" },
  { href: "#vacunatorio", label: "Vacunatorio" },
  { href: "#obras-sociales", label: "Obras sociales" },
  { href: "#ubicacion", label: "Ubicación" },
  { href: "#contacto", label: "Contacto" },
];

export function Navbar() {
  const settings = useSettings();
  const waUrl = useWhatsAppUrl();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-medical-blue/10 bg-warm-white/95 shadow-soft backdrop-blur-lg"
          : "bg-warm-white/80 backdrop-blur-md"
      )}
    >
      <nav className="section-container flex h-16 items-center justify-between gap-4 md:h-[4.5rem]">
        <Link href="/" className="group min-w-0">
          <p className="truncate font-display text-base font-bold tracking-tight text-medical-deep md:text-lg">
            {settings.clinicName}
          </p>
          <p className="hidden items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-medical-teal sm:flex">
            <Clock className="h-3 w-3" />
            24 hs · Corrientes
          </p>
        </Link>

        <ul className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm font-medium text-text-muted transition hover:text-medical-deep"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 lg:flex">
          <Button variant="whatsapp" size="sm" href={waUrl} external>
            <WhatsAppIcon size={18} />
            WhatsApp 24 hs
          </Button>
        </div>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-medical-blue/10 bg-white shadow-soft lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <div
        className={cn(
          "fixed inset-0 top-16 z-40 bg-medical-deep/40 backdrop-blur-sm transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setOpen(false)}
      />

      <div
        className={cn(
          "fixed right-0 top-16 z-50 flex h-[calc(100dvh-4rem)] w-full max-w-sm flex-col border-l border-medical-blue/10 bg-warm-white shadow-float transition-transform duration-300 lg:hidden",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <ul className="flex-1 overflow-y-auto p-4">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block rounded-xl px-4 py-3.5 text-base font-medium text-medical-deep active:bg-medical-sky/60"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="border-t border-medical-blue/10 p-4">
          <Button variant="whatsapp" size="lg" href={waUrl} external className="w-full">
            <WhatsAppIcon size={20} />
            WhatsApp 24 hs
          </Button>
        </div>
      </div>
    </header>
  );
}
