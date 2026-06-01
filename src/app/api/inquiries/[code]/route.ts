import { apiError, apiSuccess } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: { code: string } }
) {
  try {
    const inquiry = await prisma.inquiryRequest.findUnique({
      where: { inquiryCode: params.code.toUpperCase() },
      select: {
        inquiryCode: true,
        status: true,
        serviceRequested: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!inquiry) {
      return apiError("Solicitud no encontrada", 404);
    }

    return apiSuccess(inquiry);
  } catch (error) {
    console.error("GET /api/inquiries/[code]:", error);
    return apiError("Error al consultar solicitud", 500);
  }
}
