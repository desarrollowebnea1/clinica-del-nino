import { sanitizeGoogleMapsEmbedUrl } from "@/lib/maps-embed";

export type ClinicSettingsForm = {
  clinicName: string;
  slogan: string;
  whatsappNumber: string;
  phone: string;
  email: string;
  instagramUrl: string;
  facebookUrl: string;
  address: string;
  mapsUrl: string;
  mapsEmbedUrl: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroImageUrl: string;
  logoUrl: string;
  openingHoursJson: string;
  emergencyNotice: string;
  legalNotice: string;
};

export function settingsFromDb(d: Record<string, unknown>): ClinicSettingsForm {
  return {
    clinicName: String(d.clinicName ?? ""),
    slogan: String(d.slogan ?? ""),
    whatsappNumber: String(d.whatsappNumber ?? ""),
    phone: String(d.phone ?? ""),
    email: String(d.email ?? ""),
    instagramUrl: String(d.instagramUrl ?? ""),
    facebookUrl: String(d.facebookUrl ?? ""),
    address: String(d.address ?? ""),
    mapsUrl: String(d.mapsUrl ?? ""),
    mapsEmbedUrl: String(d.mapsEmbedUrl ?? ""),
    heroTitle: String(d.heroTitle ?? ""),
    heroSubtitle: String(d.heroSubtitle ?? ""),
    heroDescription: String(d.heroDescription ?? ""),
    heroImageUrl: String(d.heroImageUrl ?? ""),
    logoUrl: String(d.logoUrl ?? ""),
    openingHoursJson: String(d.openingHoursJson ?? "{}"),
    emergencyNotice: String(d.emergencyNotice ?? ""),
    legalNotice: String(d.legalNotice ?? ""),
  };
}

export function settingsToDbPayload(form: ClinicSettingsForm) {
  let openingHoursJson = "{}";
  try {
    const parsed = JSON.parse(form.openingHoursJson || "{}");
    openingHoursJson = JSON.stringify(parsed);
  } catch {
    throw new Error("Horarios (JSON) no es válido. Revisá las llaves y comillas.");
  }

  return {
    clinicName: form.clinicName.trim(),
    slogan: form.slogan.trim(),
    whatsappNumber: form.whatsappNumber.trim(),
    phone: form.phone.trim(),
    email: form.email.trim(),
    instagramUrl: form.instagramUrl.trim() || null,
    facebookUrl: form.facebookUrl.trim() || null,
    address: form.address.trim(),
    mapsUrl: form.mapsUrl.trim() || null,
    mapsEmbedUrl: sanitizeGoogleMapsEmbedUrl(form.mapsEmbedUrl),
    heroTitle: form.heroTitle.trim(),
    heroSubtitle: form.heroSubtitle.trim(),
    heroDescription: form.heroDescription.trim(),
    heroImageUrl: form.heroImageUrl.trim() || null,
    logoUrl: form.logoUrl.trim() || null,
    openingHoursJson,
    emergencyNotice: form.emergencyNotice.trim(),
    legalNotice: form.legalNotice.trim(),
  };
}
