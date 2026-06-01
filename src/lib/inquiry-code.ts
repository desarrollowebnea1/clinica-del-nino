import { prisma } from "@/lib/prisma";

export async function generateInquiryCode(): Promise<string> {
  const today = new Date();
  const datePart = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("");

  const prefix = `CDN-${datePart}`;

  const count = await prisma.inquiryRequest.count({
    where: {
      inquiryCode: { startsWith: prefix },
    },
  });

  const sequence = String(count + 1).padStart(4, "0");
  return `${prefix}-${sequence}`;
}
