import { apiError, apiSuccess } from "@/lib/api";
import { submitInquiry } from "@/lib/inquiries/submit-inquiry";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await submitInquiry(body);

    if (!result.ok) {
      return apiError(result.error, result.status);
    }

    return apiSuccess(result.data, result.status);
  } catch (error) {
    console.error("POST /api/inquiries:", error);
    return apiError("Error al registrar solicitud", 500);
  }
}
