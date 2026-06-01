import { requireAdminSession } from "@/lib/admin-auth";
import { apiError, apiSuccess } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { error } = await requireAdminSession();
  if (error) return error;

  const content = await prisma.siteContent.findMany({
    orderBy: [{ section: "asc" }, { sortOrder: "asc" }],
  });

  return apiSuccess(content);
}

export async function PUT(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;

  const body = await request.json();
  const items = Array.isArray(body) ? body : [body];

  const updated = [];
  for (const item of items) {
    if (!item.section || !item.key) {
      return apiError("section y key son requeridos");
    }

    const record = await prisma.siteContent.upsert({
      where: {
        section_key: { section: item.section, key: item.key },
      },
      update: {
        value: item.value,
        label: item.label,
        type: item.type,
        sortOrder: item.sortOrder,
      },
      create: {
        section: item.section,
        key: item.key,
        label: item.label || item.key,
        value: item.value,
        type: item.type || "TEXT",
        sortOrder: item.sortOrder ?? 0,
      },
    });
    updated.push(record);
  }

  return apiSuccess(updated);
}
