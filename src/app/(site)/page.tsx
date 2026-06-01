import { FAQSection } from "@/components/home/FAQSection";
import { GuardiaSection } from "@/components/home/GuardiaSection";
import { Hero } from "@/components/home/Hero";
import { InquirySection } from "@/components/home/InquirySection";
import { InsuranceSection } from "@/components/home/InsuranceSection";
import { InternacionSection } from "@/components/home/InternacionSection";
import { LocationSection } from "@/components/home/LocationSection";
import { NeonatologiaSection } from "@/components/home/NeonatologiaSection";
import { QuickActionSection } from "@/components/home/QuickActionSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { TrustBar } from "@/components/home/TrustBar";
import { VaccineSection } from "@/components/home/VaccineSection";
import {
  getActiveFaqs,
  getActiveInsurance,
  getActiveServices,
  getClinicSettings,
  getSiteContentBySection,
  getVaccineContent,
} from "@/lib/data";

export const dynamic = "force-dynamic";

const DEFAULT_SUBTITLE =
  "Atención pediátrica 24 horas, los 365 días del año.";

const DEFAULT_HERO_DESCRIPTION =
  "Guardia pediátrica permanente, internación clínica y quirúrgica, vacunatorio, neonatología, terapia intensiva, laboratorio y rayos X en Corrientes Capital.";

export default async function HomePage() {
  const [
    settings,
    services,
    insurance,
    faqs,
    vaccine,
    guardia,
    internacion,
    neonatologia,
  ] = await Promise.all([
    getClinicSettings(),
    getActiveServices(),
    getActiveInsurance(),
    getActiveFaqs(),
    getVaccineContent(),
    getSiteContentBySection("guardia"),
    getSiteContentBySection("internacion"),
    getSiteContentBySection("neonatologia"),
  ]);

  const openingHours = settings
    ? (JSON.parse(settings.openingHoursJson || "{}") as Record<string, string>)
    : { guardia: "24 horas, todos los días" };

  const guardiaItems = Array.isArray(guardia.items)
    ? (guardia.items as string[])
    : [
        "Evaluación médica pediátrica",
        "Diagnóstico inicial",
        "Orientación terapéutica",
        "Derivación a estudios si corresponde",
        "Atención permanente",
      ];

  const whatsappNumber = settings?.whatsappNumber ?? "";

  return (
    <>
      <Hero
        title={settings?.heroTitle ?? "Clínica del Niño"}
        subtitle={settings?.heroSubtitle ?? DEFAULT_SUBTITLE}
        description={settings?.heroDescription ?? DEFAULT_HERO_DESCRIPTION}
        heroImageUrl={settings?.heroImageUrl}
        whatsappNumber={whatsappNumber}
        mapsUrl={settings?.mapsUrl}
      />

      <QuickActionSection whatsappNumber={whatsappNumber} />
      <TrustBar />

      {services.length > 0 && (
        <ServicesSection services={services} whatsappNumber={whatsappNumber} />
      )}

      <GuardiaSection
        title={(guardia.title as string) || "Guardia pediátrica 24/7"}
        description={
          (guardia.description as string) ||
          "Atención pediátrica en consultorio durante las 24 horas, todos los días del año."
        }
        items={guardiaItems}
        emergencyNotice={
          settings?.emergencyNotice ??
          "Ante emergencias graves, concurrir inmediatamente al centro de salud más cercano o comunicarse con el servicio de emergencias (107)."
        }
        whatsappNumber={whatsappNumber}
      />

      <InternacionSection
        title={(internacion.title as string) || "Internación clínica y quirúrgica"}
        description={
          (internacion.description as string) ||
          "Hospitalización pediátrica con seguimiento médico continuo, cuidados clínicos y acompañamiento postoperatorio en un entorno institucional seguro en Corrientes Capital."
        }
      />

      {vaccine && (
        <VaccineSection vaccine={vaccine} whatsappNumber={whatsappNumber} />
      )}

      <NeonatologiaSection
        title={(neonatologia.title as string) || "Neonatología y terapia intensiva pediátrica"}
        description={
          (neonatologia.description as string) ||
          "Áreas institucionales de cuidados especializados para recién nacidos y pacientes pediátricos que requieren monitoreo intensivo."
        }
      />

      {insurance.length > 0 && (
        <InsuranceSection
          providers={insurance}
          whatsappNumber={whatsappNumber}
        />
      )}

      <InquirySection services={services} whatsappNumber={whatsappNumber} />

      <LocationSection
        address={settings?.address ?? "Corrientes Capital, Argentina"}
        mapsUrl={settings?.mapsUrl}
        mapsEmbedUrl={settings?.mapsEmbedUrl}
        openingHours={openingHours}
        whatsappNumber={whatsappNumber}
      />

      {faqs.length > 0 && <FAQSection faqs={faqs} />}
    </>
  );
}
