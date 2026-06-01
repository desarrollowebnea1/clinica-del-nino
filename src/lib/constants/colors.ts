/** Design tokens — Clínica del Niño */
export const colors = {
  warmWhite: "#FAFBFC",
  medicalSky: "#EAF7FA",
  institutionalDeep: "#0B3558",
  institutionalBlue: "#123A5A",
  healthTeal: "#5EC8B5",
  healthGreen: "#22C55E",
  softCoral: "#FF8A7A",
  textMuted: "#5F6F7A",
  softBackground: "#F4F9FA",
} as const;

/** Slugs de servicios con mayor jerarquía visual */
export const FEATURED_SERVICE_SLUGS = new Set([
  "guardia-pediatrica-24-7",
  "internacion-clinica",
  "internacion-quirurgica",
  "vacunatorio",
  "neonatologia",
  "uti-pediatrica",
  "laboratorio",
  "rayos-x",
]);

export const SERVICE_VALUE_COPY: Record<string, string> = {
  "guardia-pediatrica-24-7":
    "Evaluación pediátrica inmediata en consultorio, todos los días del año.",
  "internacion-clinica":
    "Cuidados clínicos con seguimiento médico en entorno hospitalario pediátrico.",
  "internacion-quirurgica":
    "Internación quirúrgica y acompañamiento postoperatorio institucional.",
  vacunatorio:
    "Vacunas del Calendario Nacional e inyectables indicados por profesionales.",
  neonatologia: "Atención especializada para recién nacidos.",
  "uti-pediatrica": "Unidad de terapia intensiva pediátrica institucional.",
  laboratorio: "Análisis clínicos y estudios de laboratorio pediátrico.",
  "rayos-x": "Estudios por imágenes en el mismo centro.",
  "aplicacion-inyectables":
    "Aplicación de medicación inyectable según indicación médica.",
  "estudios-complementarios":
    "Estudios diagnósticos complementarios para orientar la atención.",
};
