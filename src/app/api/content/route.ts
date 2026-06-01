import { apiError, apiSuccess } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section");

    const content = await prisma.siteContent.findMany({
      where: section ? { section } : undefined,
      orderBy: [{ section: "asc" }, { sortOrder: "asc" }],
    });

    const grouped = content.reduce(
      (acc, item) => {
        if (!acc[item.section]) acc[item.section] = {};
        let value: string | unknown = item.value;
        if (item.type === "JSON") {
          try {
            value = JSON.parse(item.value);
          } catch {
            value = item.value;
          }
        }
        acc[item.section][item.key] = value;
        return acc;
      },
      {} as Record<string, Record<string, unknown>>
    );

    return apiSuccess(section ? grouped[section] ?? {} : grouped);
  } catch (error) {
    console.error("GET /api/content:", error);
    return apiError("Error al obtener contenido", 500);
  }
}
