import { requireAdminSession } from "@/lib/admin-auth";
import { apiError, apiSuccess } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";

export async function GET(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim().toLowerCase();

  const providers = await prisma.insuranceProvider.findMany({
    where: q
      ? { name: { contains: q, mode: "insensitive" } }
      : undefined,
    orderBy: { sortOrder: "asc" },
  });
  return apiSuccess(providers);
}

export async function POST(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;

  const body = await request.json();

  if (body.bulk && typeof body.bulk === "string") {
    const names: string[] = Array.from(
      new Set<string>(
        body.bulk
          .split("\n")
          .map((n: string) => n.trim())
          .filter(Boolean)
      )
    );

    const maxOrder = await prisma.insuranceProvider.aggregate({
      _max: { sortOrder: true },
    });
    let order = maxOrder._max.sortOrder ?? 0;

    const results = [];
    for (const name of names) {
      const slug = slugify(name);
      const provider = await prisma.insuranceProvider.upsert({
        where: { slug },
        update: { name, active: true },
        create: { name, slug, active: true, sortOrder: ++order },
      });
      results.push(provider);
    }
    return apiSuccess({ imported: results.length, providers: results }, 201);
  }

  const name = body.name?.trim();
  if (!name) return apiError("Nombre requerido");

  const slug = body.slug?.trim() || slugify(name);

  const provider = await prisma.insuranceProvider.upsert({
    where: { slug },
    update: {
      name,
      active: body.active ?? true,
      notes: body.notes ?? null,
      sortOrder: body.sortOrder ?? undefined,
    },
    create: {
      name,
      slug,
      active: body.active ?? true,
      notes: body.notes || null,
      sortOrder: Number(body.sortOrder) || 0,
    },
  });

  return apiSuccess(provider, 201);
}

export async function PUT(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;

  const body = await request.json();
  if (!body.id) return apiError("ID requerido");

  const data: Record<string, unknown> = {};
  if (body.name !== undefined) data.name = body.name;
  if (body.slug !== undefined) data.slug = body.slug;
  if (body.active !== undefined) data.active = body.active;
  if (body.notes !== undefined) data.notes = body.notes || null;
  if (body.sortOrder !== undefined) data.sortOrder = Number(body.sortOrder);

  const provider = await prisma.insuranceProvider.update({
    where: { id: body.id },
    data,
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
