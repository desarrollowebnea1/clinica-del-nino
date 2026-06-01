import { requireAdminSession } from "@/lib/admin-auth";
import { settingsToDbPayload } from "@/lib/admin/settings-mapper";
import { apiError, apiSuccess } from "@/lib/api";
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

  try {
    const body = await request.json();
    const data = settingsToDbPayload(body);

    const settings = await prisma.clinicSettings.upsert({
      where: { id: "default" },
      update: data,
      create: { id: "default", ...data },
    });

    return apiSuccess(settings);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Error al guardar configuración";
    console.error("PUT /api/admin/settings:", err);
    return apiError(message, 400);
  }
}
