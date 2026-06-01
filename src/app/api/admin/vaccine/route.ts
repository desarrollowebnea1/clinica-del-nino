import { requireAdminSession } from "@/lib/admin-auth";
import { apiError, apiSuccess } from "@/lib/api";
import { prisma } from "@/lib/prisma";

function vaccinePayload(body: Record<string, unknown>) {
  return {
    title: String(body.title ?? ""),
    description: String(body.description ?? ""),
    calendarVaccines: String(body.calendarVaccines ?? ""),
    injectablesInfo: String(body.injectablesInfo ?? ""),
    requirements: String(body.requirements ?? ""),
    schedules: String(body.schedules ?? ""),
    active: body.active !== false && body.active !== "false",
  };
}

export async function GET() {
  const { error } = await requireAdminSession();
  if (error) return error;

  const vaccine = await prisma.vaccineContent.findUnique({
    where: { id: "default" },
  });

  return apiSuccess(vaccine);
}

export async function PUT(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const body = await request.json();
    const data = vaccinePayload(body);

    const vaccine = await prisma.vaccineContent.upsert({
      where: { id: "default" },
      update: data,
      create: { id: "default", ...data },
    });

    return apiSuccess(vaccine);
  } catch (err) {
    console.error("PUT /api/admin/vaccine:", err);
    return apiError("Error al guardar vacunatorio", 500);
  }
}
