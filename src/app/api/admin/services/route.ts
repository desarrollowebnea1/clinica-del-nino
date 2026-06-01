import { requireAdminSession } from "@/lib/admin-auth";
import { apiError, apiSuccess } from "@/lib/api";
import { prisma } from "@/lib/prisma";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function GET() {
  const { error } = await requireAdminSession();
  if (error) return error;

  const services = await prisma.service.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return apiSuccess(services);
}

export async function POST(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;

  const body = await request.json();
  const name = body.name?.trim();
  if (!name) return apiError("Nombre requerido");

  const slug = body.slug?.trim() || slugify(name);

  const service = await prisma.service.create({
    data: {
      name,
      slug,
      shortDescription: body.shortDescription || "",
      longDescription: body.longDescription || "",
      icon: body.icon || "stethoscope",
      imageUrl: body.imageUrl || null,
      category: body.category || null,
      active: body.active ?? true,
      featured: body.featured ?? false,
      sortOrder: body.sortOrder ?? 0,
    },
  });

  return apiSuccess(service, 201);
}

export async function PUT(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;

  const body = await request.json();
  if (!body.id) return apiError("ID requerido");

  const service = await prisma.service.update({
    where: { id: body.id },
    data: {
      name: body.name,
      slug: body.slug,
      shortDescription: body.shortDescription,
      longDescription: body.longDescription,
      icon: body.icon,
      imageUrl: body.imageUrl,
      category: body.category,
      active: body.active,
      featured: body.featured,
      sortOrder: body.sortOrder,
    },
  });

  return apiSuccess(service);
}

export async function DELETE(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return apiError("ID requerido");

  await prisma.service.delete({ where: { id } });
  return apiSuccess({ deleted: true });
}
