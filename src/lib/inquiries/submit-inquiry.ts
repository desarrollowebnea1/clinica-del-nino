import { generateInquiryCode } from "@/lib/inquiry-code";
import { prisma } from "@/lib/prisma";
import { buildInquiryWhatsAppMessage, buildWhatsAppUrl } from "@/lib/whatsapp";

export type InquiryFormPayload = {
  childName?: string;
  childAge?: string;
  guardianName?: string;
  guardianPhone?: string;
  serviceRequested?: string;
  insuranceProvider?: string;
  reason?: string;
  message?: string;
};

export async function submitInquiry(body: InquiryFormPayload) {
  const {
    childName,
    childAge,
    guardianName,
    guardianPhone,
    serviceRequested,
    insuranceProvider,
    reason,
    message,
  } = body;

  if (
    !childName?.trim() ||
    !childAge?.trim() ||
    !guardianName?.trim() ||
    !guardianPhone?.trim() ||
    !serviceRequested?.trim() ||
    !reason?.trim()
  ) {
    return {
      ok: false as const,
      status: 400,
      error: "Completá todos los campos obligatorios",
    };
  }

  const inquiryCode = await generateInquiryCode();
  const whatsappMessage = buildInquiryWhatsAppMessage({
    inquiryCode,
    childName: childName.trim(),
    childAge: childAge.trim(),
    guardianName: guardianName.trim(),
    guardianPhone: guardianPhone.trim(),
    serviceRequested: serviceRequested.trim(),
    insuranceProvider: insuranceProvider?.trim(),
    reason: reason.trim(),
    message: message?.trim(),
  });

  const inquiry = await prisma.inquiryRequest.create({
    data: {
      inquiryCode,
      childName: childName.trim(),
      childAge: childAge.trim(),
      guardianName: guardianName.trim(),
      guardianPhone: guardianPhone.trim(),
      serviceRequested: serviceRequested.trim(),
      insuranceProvider: insuranceProvider?.trim() || null,
      reason: reason.trim(),
      message: message?.trim() || null,
      whatsappMessage,
    },
  });

  const settings = await prisma.clinicSettings.findUnique({
    where: { id: "default" },
  });

  const whatsappUrl = settings?.whatsappNumber
    ? buildWhatsAppUrl(settings.whatsappNumber, whatsappMessage)
    : null;

  return {
    ok: true as const,
    status: 201,
    data: {
      inquiry,
      whatsappUrl,
    },
  };
}
