import { apiError, apiSuccess } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const settings = await prisma.clinicSettings.findUnique({
      where: { id: "default" },
    });

    if (!settings) {
      return apiError("Configuración no encontrada", 404);
    }

    return apiSuccess({
      clinicName: settings.clinicName,
      slogan: settings.slogan,
      whatsappNumber: settings.whatsappNumber,
      phone: settings.phone,
      email: settings.email,
      instagramUrl: settings.instagramUrl,
      facebookUrl: settings.facebookUrl,
      address: settings.address,
      mapsUrl: settings.mapsUrl,
      mapsEmbedUrl: settings.mapsEmbedUrl,
      heroTitle: settings.heroTitle,
      heroSubtitle: settings.heroSubtitle,
      heroDescription: settings.heroDescription,
      heroImageUrl: settings.heroImageUrl,
      logoUrl: settings.logoUrl,
      openingHours: JSON.parse(settings.openingHoursJson || "{}"),
      emergencyNotice: settings.emergencyNotice,
      legalNotice: settings.legalNotice,
    });
  } catch (error) {
    console.error("GET /api/settings:", error);
    return apiError("Error al obtener configuración", 500);
  }
}
