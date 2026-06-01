import { apiError, apiSuccess } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get("featured") === "true";
    const activeOnly = searchParams.get("active") !== "false";

    const services = await prisma.service.findMany({
      where: {
        ...(activeOnly ? { active: true } : {}),
        ...(featured ? { featured: true } : {}),
      },
      orderBy: { sortOrder: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        shortDescription: true,
        longDescription: true,
        icon: true,
        imageUrl: true,
        category: true,
        featured: true,
        sortOrder: true,
      },
    });

    return apiSuccess(services);
  } catch (error) {
    console.error("GET /api/services:", error);
    return apiError("Error al obtener servicios", 500);
  }
}
