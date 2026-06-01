import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import {
  SettingsProvider,
  type ClinicSettingsPublic,
} from "@/components/providers/SettingsProvider";
import { getClinicSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

const defaultSettings: ClinicSettingsPublic = {
  clinicName: "Clínica del Niño",
  slogan: "Atención pediátrica 24 horas, los 365 días del año.",
  whatsappNumber: "",
  phone: "",
  email: "",
  address: "Corrientes Capital, Argentina",
  heroTitle: "Clínica del Niño",
  heroSubtitle: "Atención pediátrica 24 horas, los 365 días del año.",
  heroDescription:
    "Guardia pediátrica, internación clínica y quirúrgica, vacunatorio, neonatología, terapia intensiva y servicios complementarios en Corrientes Capital.",
  openingHours: { guardia: "24 horas, todos los días" },
  emergencyNotice:
    "Ante emergencias graves, concurrir inmediatamente o comunicarse con servicios de emergencia.",
  legalNotice:
    "La información publicada no reemplaza una evaluación médica profesional.",
};

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dbSettings = await getClinicSettings();

  const settings: ClinicSettingsPublic = dbSettings
    ? {
        clinicName: dbSettings.clinicName,
        slogan: dbSettings.slogan,
        whatsappNumber: dbSettings.whatsappNumber,
        phone: dbSettings.phone,
        email: dbSettings.email,
        instagramUrl: dbSettings.instagramUrl,
        facebookUrl: dbSettings.facebookUrl,
        address: dbSettings.address,
        mapsUrl: dbSettings.mapsUrl,
        mapsEmbedUrl: dbSettings.mapsEmbedUrl,
        heroTitle: dbSettings.heroTitle,
        heroSubtitle: dbSettings.heroSubtitle,
        heroDescription: dbSettings.heroDescription,
        heroImageUrl: dbSettings.heroImageUrl,
        logoUrl: dbSettings.logoUrl,
        openingHours: JSON.parse(dbSettings.openingHoursJson || "{}"),
        emergencyNotice: dbSettings.emergencyNotice,
        legalNotice: dbSettings.legalNotice,
      }
    : defaultSettings;

  return (
    <SettingsProvider settings={settings}>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </SettingsProvider>
  );
}
