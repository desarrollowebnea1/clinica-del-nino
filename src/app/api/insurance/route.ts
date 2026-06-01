import { apiError, apiSuccess } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim().toLowerCase();

    const providers = await prisma.insuranceProvider.findMany({
      where: {
        active: true,
        ...(q
          ? {
              name: { contains: q, mode: "insensitive" },
            }
          : {}),
      },
      orderBy: { sortOrder: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        notes: true,
      },
    });

    return apiSuccess(providers);
  } catch (error) {
    console.error("GET /api/insurance:", error);
    return apiError("Error al obtener obras sociales", 500);
  }
}
