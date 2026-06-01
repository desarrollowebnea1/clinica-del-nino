/** Normaliza número argentino para wa.me (solo dígitos, con código país 54) */
export function normalizeArgentinePhone(phone: string): string {
  let digits = phone.replace(/\D/g, "");

  if (digits.startsWith("00")) {
    digits = digits.slice(2);
  }

  if (digits.startsWith("54")) {
    return digits;
  }

  if (digits.startsWith("0")) {
    digits = digits.slice(1);
  }

  if (digits.startsWith("15") && digits.length >= 10) {
    digits = "9" + digits;
  }

  if (!digits.startsWith("54")) {
    digits = "54" + digits;
  }

  return digits;
}

export function buildWhatsAppUrl(phone: string, message?: string): string {
  const normalized = normalizeArgentinePhone(phone);
  const base = `https://wa.me/${normalized}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function buildInquiryWhatsAppMessage(data: {
  inquiryCode: string;
  childName: string;
  childAge: string;
  guardianName: string;
  guardianPhone: string;
  serviceRequested: string;
  insuranceProvider?: string;
  reason: string;
  message?: string;
}): string {
  return `Hola Clínica del Niño, quiero realizar una consulta/solicitud de atención.

Código: ${data.inquiryCode}
Niño/a: ${data.childName}
Edad: ${data.childAge}
Responsable: ${data.guardianName}
WhatsApp: ${data.guardianPhone}
Servicio requerido: ${data.serviceRequested}
Obra social: ${data.insuranceProvider || "No especificada"}
Motivo: ${data.reason}
Mensaje: ${data.message || "-"}`;
}

export function buildAdminReplyMessage(
  guardianName: string,
  inquiryCode: string
): string {
  return `Hola ${guardianName}, somos de Clínica del Niño. Recibimos tu solicitud ${inquiryCode}. Te escribimos para coordinar la atención.`;
}

export function buildInquiryStatusWhatsAppMessage(inquiryCode: string): string {
  return `Hola Clínica del Niño, quiero consultar el estado de mi solicitud ${inquiryCode}.`;
}
