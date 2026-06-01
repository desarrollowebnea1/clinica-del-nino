"use client";

import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { createContext, useContext, type ReactNode } from "react";

export type ClinicSettingsPublic = {
  clinicName: string;
  slogan: string;
  whatsappNumber: string;
  phone: string;
  email: string;
  instagramUrl?: string | null;
  facebookUrl?: string | null;
  address: string;
  mapsUrl?: string | null;
  mapsEmbedUrl?: string | null;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroImageUrl?: string | null;
  logoUrl?: string | null;
  openingHours: Record<string, string>;
  emergencyNotice: string;
  legalNotice: string;
};

const SettingsContext = createContext<ClinicSettingsPublic | null>(null);

export function SettingsProvider({
  settings,
  children,
}: {
  settings: ClinicSettingsPublic;
  children: ReactNode;
}) {
  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error("useSettings debe usarse dentro de SettingsProvider");
  }
  return ctx;
}

export function useWhatsAppUrl(message?: string) {
  const { whatsappNumber } = useSettings();
  if (!whatsappNumber) return "#";
  return buildWhatsAppUrl(whatsappNumber, message);
}
