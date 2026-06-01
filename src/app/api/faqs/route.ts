import { apiError, apiSuccess } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const faqs = await prisma.fAQ.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
      select: {
        id: true,
        question: true,
        answer: true,
        sortOrder: true,
      },
    });

    return apiSuccess(faqs);
  } catch (error) {
    console.error("GET /api/faqs:", error);
    return apiError("Error al obtener preguntas frecuentes", 500);
  }
}
