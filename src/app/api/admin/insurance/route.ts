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

  const providers = await prisma.insuranceProvider.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return apiSuccess(providers);
}

export async function POST(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;

  const body = await request.json();

  if (body.bulk && typeof body.bulk === "string") {
    const names = body.bulk
      .split("\n")
      .map((n: string) => n.trim())
      .filter(Boolean);

    const existing = await prisma.insuranceProvider.count();
    let order = existing;

    const created = [];
    for (const name of names) {
      const slug = slugify(name);
      const provider = await prisma.insuranceProvider.upsert({
        where: { slug },
        update: { name, active: true },
        create: { name, slug, active: true, sortOrder: ++order },
      });
      created.push(provider);
    }
    return apiSuccess(created, 201);
  }

  const name = body.name?.trim();
  if (!name) return apiError("Nombre requerido");

  const provider = await prisma.insuranceProvider.create({
    data: {
      name,
      slug: body.slug?.trim() || slugify(name),
      active: body.active ?? true,
      notes: body.notes || null,
      sortOrder: body.sortOrder ?? 0,
    },
  });

  return apiSuccess(provider, 201);
}

export async function PUT(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;

  const body = await request.json();
  if (!body.id) return apiError("ID requerido");

  const provider = await prisma.insuranceProvider.update({
    where: { id: body.id },
    data: {
      name: body.name,
      slug: body.slug,
      active: body.active,
      notes: body.notes,
      sortOrder: body.sortOrder,
    },
  });

  return apiSuccess(provider);
}

export async function DELETE(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return apiError("ID requerido");

  await prisma.insuranceProvider.delete({ where: { id } });
  return apiSuccess({ deleted: true });
}
