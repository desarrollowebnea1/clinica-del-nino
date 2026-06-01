import { apiError, apiSuccess } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const service = await prisma.service.findUnique({
      where: { slug: params.slug, active: true },
    });

    if (!service) {
      return apiError("Servicio no encontrado", 404);
    }

    return apiSuccess(service);
  } catch (error) {
    console.error("GET /api/services/[slug]:", error);
    return apiError("Error al obtener servicio", 500);
  }
}
