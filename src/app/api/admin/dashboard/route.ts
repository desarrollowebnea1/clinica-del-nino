import { requireAdminSession } from "@/lib/admin-auth";
import { apiSuccess } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { error } = await requireAdminSession();
  if (error) return error;

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [
    todayCount,
    pendingCount,
    contactedCount,
    resolvedCount,
    activeServices,
    activeInsurance,
    recentInquiries,
  ] = await Promise.all([
    prisma.inquiryRequest.count({
      where: { createdAt: { gte: startOfDay } },
    }),
    prisma.inquiryRequest.count({ where: { status: "NUEVA" } }),
    prisma.inquiryRequest.count({ where: { status: "CONTACTADA" } }),
    prisma.inquiryRequest.count({ where: { status: "RESUELTA" } }),
    prisma.service.count({ where: { active: true } }),
    prisma.insuranceProvider.count({ where: { active: true } }),
    prisma.inquiryRequest.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
  ]);

  return apiSuccess({
    todayCount,
    pendingCount,
    contactedCount,
    resolvedCount,
    activeServices,
    activeInsurance,
    recentInquiries,
  });
}
