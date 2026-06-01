export type InquiryStatusKey =
  | "NUEVA"
  | "CONTACTADA"
  | "EN_SEGUIMIENTO"
  | "RESUELTA"
  | "CANCELADA";

export type InquiryStatusData = {
  inquiryCode: string;
  status: string;
  serviceRequested: string;
  createdAt: string;
  updatedAt: string;
};

export const INQUIRY_STATUS_CONFIG: Record<
  InquiryStatusKey,
  { label: string; message: string; badgeClass: string }
> = {
  NUEVA: {
    label: "Nueva",
    message:
      "Tu solicitud fue registrada correctamente. La clínica aún debe revisarla.",
    badgeClass: "bg-medical-blue/15 text-medical-blue ring-medical-blue/25",
  },
  CONTACTADA: {
    label: "Contactada",
    message: "La clínica ya tomó contacto o intentó comunicarse.",
    badgeClass: "bg-medical-teal/15 text-medical-teal ring-medical-teal/25",
  },
  EN_SEGUIMIENTO: {
    label: "En seguimiento",
    message: "Tu solicitud se encuentra en seguimiento.",
    badgeClass: "bg-amber-500/15 text-amber-800 ring-amber-500/25",
  },
  RESUELTA: {
    label: "Resuelta",
    message: "La solicitud figura como resuelta.",
    badgeClass: "bg-health-green/15 text-health-green ring-health-green/25",
  },
  CANCELADA: {
    label: "Cancelada",
    message: "La solicitud figura como cancelada.",
    badgeClass: "bg-gray-200 text-gray-700 ring-gray-300",
  },
};

export function getInquiryStatusConfig(status: string) {
  const key = status as InquiryStatusKey;
  return (
    INQUIRY_STATUS_CONFIG[key] ?? {
      label: status,
      message: "Estado de tu solicitud actualizado.",
      badgeClass: "bg-medical-sky text-medical-deep ring-medical-blue/20",
    }
  );
}

export const LAST_INQUIRY_CODE_KEY = "cdn_last_inquiry_code";
