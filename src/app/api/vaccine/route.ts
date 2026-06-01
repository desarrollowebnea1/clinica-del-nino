import { apiError, apiSuccess } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const vaccine = await prisma.vaccineContent.findUnique({
      where: { id: "default", active: true },
    });

    if (!vaccine) {
      return apiError("Contenido de vacunatorio no disponible", 404);
    }

    return apiSuccess(vaccine);
  } catch (error) {
    console.error("GET /api/vaccine:", error);
    return apiError("Error al obtener vacunatorio", 500);
  }
}
