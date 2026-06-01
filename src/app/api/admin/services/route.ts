import { requireAdminSession } from "@/lib/admin-auth";
import { apiError, apiSuccess } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";

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

  const existing = await prisma.service.findUnique({ where: { slug } });
  if (existing) return apiError("Ya existe un servicio con ese slug");

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
      sortOrder: Number(body.sortOrder) || 0,
    },
  });

  return apiSuccess(service, 201);
}

export async function PUT(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;

  const body = await request.json();
  if (!body.id) return apiError("ID requerido");

  const data: Record<string, unknown> = {};
  if (body.name !== undefined) data.name = body.name;
  if (body.slug !== undefined) data.slug = body.slug;
  if (body.shortDescription !== undefined)
    data.shortDescription = body.shortDescription;
  if (body.longDescription !== undefined)
    data.longDescription = body.longDescription;
  if (body.icon !== undefined) data.icon = body.icon;
  if (body.imageUrl !== undefined) data.imageUrl = body.imageUrl || null;
  if (body.category !== undefined) data.category = body.category || null;
  if (body.active !== undefined) data.active = body.active;
  if (body.featured !== undefined) data.featured = body.featured;
  if (body.sortOrder !== undefined) data.sortOrder = Number(body.sortOrder);

  const service = await prisma.service.update({
    where: { id: body.id },
    data,
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
