import { requireAdminSession } from "@/lib/admin-auth";
import { apiError, apiSuccess } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import type { InquiryStatus } from "@prisma/client";

export async function GET(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") as InquiryStatus | null;
  const q = searchParams.get("q")?.trim();

  const inquiries = await prisma.inquiryRequest.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(q
        ? {
            OR: [
              { childName: { contains: q, mode: "insensitive" } },
              { guardianName: { contains: q, mode: "insensitive" } },
              { guardianPhone: { contains: q, mode: "insensitive" } },
              { serviceRequested: { contains: q, mode: "insensitive" } },
              { insuranceProvider: { contains: q, mode: "insensitive" } },
              { inquiryCode: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return apiSuccess(inquiries);
}

export async function PATCH(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;

  const body = await request.json();
  const { id, status } = body as { id?: string; status?: InquiryStatus };

  if (!id || !status) {
    return apiError("ID y estado son requeridos");
  }

  const inquiry = await prisma.inquiryRequest.update({
    where: { id },
    data: { status },
  });

  return apiSuccess(inquiry);
}
