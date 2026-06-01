import { requireAdminSession } from "@/lib/admin-auth";
import { apiSuccess } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { error } = await requireAdminSession();
  if (error) return error;

  const settings = await prisma.clinicSettings.findUnique({
    where: { id: "default" },
  });

  return apiSuccess(settings);
}

export async function PUT(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;

  const body = await request.json();

  const settings = await prisma.clinicSettings.upsert({
    where: { id: "default" },
    update: {
      clinicName: body.clinicName,
      slogan: body.slogan,
      whatsappNumber: body.whatsappNumber,
      phone: body.phone,
      email: body.email,
      instagramUrl: body.instagramUrl,
      facebookUrl: body.facebookUrl,
      address: body.address,
      mapsUrl: body.mapsUrl,
      mapsEmbedUrl: body.mapsEmbedUrl,
      heroTitle: body.heroTitle,
      heroSubtitle: body.heroSubtitle,
      heroDescription: body.heroDescription,
      heroImageUrl: body.heroImageUrl,
      logoUrl: body.logoUrl,
      openingHoursJson:
        typeof body.openingHours === "object"
          ? JSON.stringify(body.openingHours)
          : body.openingHoursJson,
      emergencyNotice: body.emergencyNotice,
      legalNotice: body.legalNotice,
    },
    create: { id: "default", ...body },
  });

  return apiSuccess(settings);
}
