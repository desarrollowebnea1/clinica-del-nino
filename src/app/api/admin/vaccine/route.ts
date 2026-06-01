import { requireAdminSession } from "@/lib/admin-auth";
import { apiSuccess } from "@/lib/api";
import { prisma } from "@/lib/prisma";

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

  const body = await request.json();

  const vaccine = await prisma.vaccineContent.upsert({
    where: { id: "default" },
    update: body,
    create: { id: "default", ...body },
  });

  return apiSuccess(vaccine);
}
