import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const INITIAL_SERVICES = [
  {
    name: "Guardia pediátrica 24/7",
    slug: "guardia-pediatrica-24-7",
    shortDescription:
      "Atención pediátrica en consultorio las 24 horas, todos los días del año.",
    longDescription:
      "Evaluación médica pediátrica, diagnóstico inicial, orientación terapéutica y derivación a estudios si corresponde.",
    icon: "heart-pulse",
    featured: true,
    sortOrder: 1,
  },
  {
    name: "Internación clínica",
    slug: "internacion-clinica",
    shortDescription: "Internación clínica pediátrica con seguimiento médico continuo.",
    icon: "building-2",
    featured: true,
    sortOrder: 2,
  },
  {
    name: "Internación quirúrgica",
    slug: "internacion-quirurgica",
    shortDescription:
      "Internación quirúrgica pediátrica y cuidados postoperatorios.",
    icon: "scissors",
    featured: true,
    sortOrder: 3,
  },
  {
    name: "Vacunatorio",
    slug: "vacunatorio",
    shortDescription:
      "Vacunas del Calendario Nacional y aplicación de inyectables indicados.",
    icon: "syringe",
    featured: true,
    sortOrder: 4,
  },
  {
    name: "Neonatología",
    slug: "neonatologia",
    shortDescription: "Atención especializada para recién nacidos.",
    icon: "baby",
    sortOrder: 5,
  },
  {
    name: "Unidad de terapia intensiva pediátrica",
    slug: "uti-pediatrica",
    shortDescription: "Cuidados intensivos pediátricos institucionales.",
    icon: "activity",
    sortOrder: 6,
  },
  {
    name: "Laboratorio",
    slug: "laboratorio",
    shortDescription: "Análisis clínicos y estudios de laboratorio.",
    icon: "flask-conical",
    sortOrder: 7,
  },
  {
    name: "Rayos X",
    slug: "rayos-x",
    shortDescription: "Estudios por imágenes pediátricos.",
    icon: "scan",
    sortOrder: 8,
  },
  {
    name: "Aplicación de inyectables",
    slug: "aplicacion-inyectables",
    shortDescription:
      "Aplicación de medicación inyectable indicada por profesionales.",
    icon: "syringe",
    sortOrder: 9,
  },
  {
    name: "Estudios complementarios",
    slug: "estudios-complementarios",
    shortDescription: "Estudios diagnósticos complementarios pediátricos.",
    icon: "clipboard-list",
    sortOrder: 10,
  },
];

const SAMPLE_INSURANCE = [
  "OSDE",
  "Swiss Medical",
  "Galeno",
  "Medifé",
  "Sancor Salud",
  "Omint",
  "Accord Salud",
  "Jerárquicos Salud",
  "OSPRERA",
  "PAMI",
  "IOMA",
  "OSDE 210",
  "Prevención Salud",
  "WILLIAM HOPE",
  "Medicus",
];

const INITIAL_FAQS = [
  {
    question: "¿Atienden las 24 horas?",
    answer:
      "Sí. La Clínica del Niño brinda atención pediátrica las 24 horas, los 365 días del año, con guardia pediátrica permanente en consultorio.",
    sortOrder: 1,
  },
  {
    question: "¿La guardia funciona todos los días?",
    answer:
      "Sí. La guardia pediátrica está disponible todos los días del año, incluidos feriados y fines de semana.",
    sortOrder: 2,
  },
  {
    question: "¿Qué debo llevar a la consulta?",
    answer:
      "Documentación del niño/a, credencial de obra social si corresponde, estudios previos y medicación habitual. Ante dudas, consultá por WhatsApp.",
    sortOrder: 3,
  },
  {
    question: "¿Trabajan con obras sociales?",
    answer:
      "Sí. Trabajamos con más de 80 obras sociales. Podés consultar cobertura por WhatsApp o en la sección de obras sociales.",
    sortOrder: 4,
  },
  {
    question: "¿Tienen vacunatorio?",
    answer:
      "Sí. Contamos con vacunatorio pediátrico con vacunas del Calendario Nacional y aplicación de inyectables indicados por profesionales.",
    sortOrder: 5,
  },
  {
    question: "¿Aplican vacunas del calendario?",
    answer: "Sí. Aplicamos vacunas del Calendario Nacional según edad y normativa vigente.",
    sortOrder: 6,
  },
  {
    question: "¿Atienden recién nacidos?",
    answer:
      "Sí. Contamos con área de neonatología y atención pediátrica especializada.",
    sortOrder: 7,
  },
  {
    question: "¿Qué hago ante una urgencia grave?",
    answer:
      "Ante emergencias graves, concurrir inmediatamente al centro de salud más cercano o comunicarse con servicios de emergencia (107).",
    sortOrder: 8,
  },
];

const SITE_CONTENT_SECTIONS = [
  {
    section: "guardia",
    key: "title",
    label: "Título sección guardia",
    value: "Guardia pediátrica 24/7",
  },
  {
    section: "guardia",
    key: "description",
    label: "Descripción guardia",
    value:
      "Atención pediátrica en consultorio durante las 24 horas, todos los días del año.",
  },
  {
    section: "guardia",
    key: "items",
    label: "Items guardia",
    value: JSON.stringify([
      "Evaluación médica pediátrica",
      "Diagnóstico inicial",
      "Orientación terapéutica",
      "Derivación a estudios si corresponde",
      "Atención permanente",
    ]),
    type: "JSON" as const,
  },
  {
    section: "internacion",
    key: "title",
    label: "Título internación",
    value: "Internación clínica y quirúrgica",
  },
  {
    section: "internacion",
    key: "description",
    label: "Descripción internación",
    value:
      "Internación pediátrica con seguimiento médico, cuidados clínicos y postoperatorios en un entorno institucional seguro.",
  },
  {
    section: "neonatologia",
    key: "title",
    label: "Título neonatología/UTI",
    value: "Neonatología y terapia intensiva pediátrica",
  },
  {
    section: "neonatologia",
    key: "description",
    label: "Descripción neonatología/UTI",
    value:
      "Áreas institucionales de cuidados especializados para recién nacidos y pacientes que requieren terapia intensiva pediátrica.",
  },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function main() {
  console.log("🌱 Iniciando seed...");

  const passwordHash = await bcrypt.hash("admin123456", 12);

  await prisma.user.upsert({
    where: { email: "admin@clinicadelnino.com" },
    update: {},
    create: {
      name: "Administrador",
      email: "admin@clinicadelnino.com",
      passwordHash,
      role: "ADMIN",
    },
  });

  await prisma.clinicSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      clinicName: "Clínica del Niño",
      slogan: "Atención pediátrica 24 horas, los 365 días del año.",
      whatsappNumber: "543794000000",
      phone: "",
      email: "contacto@clinicadelnino.com",
      address: "Corrientes Capital, Argentina",
      heroTitle: "Clínica del Niño",
      heroSubtitle: "Atención pediátrica 24 horas, los 365 días del año.",
      heroDescription:
        "Guardia pediátrica, internación clínica y quirúrgica, vacunatorio, neonatología, terapia intensiva y servicios complementarios en Corrientes Capital.",
      openingHoursJson: JSON.stringify({
        guardia: "24 horas, todos los días",
        consultorio: "Según disponibilidad — consultar por WhatsApp",
        vacunatorio: "Consultar horarios por WhatsApp",
      }),
    },
  });

  for (const service of INITIAL_SERVICES) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: service,
      create: service,
    });
  }

  for (let i = 0; i < SAMPLE_INSURANCE.length; i++) {
    const name = SAMPLE_INSURANCE[i];
    const slug = slugify(name);
    await prisma.insuranceProvider.upsert({
      where: { slug },
      update: { sortOrder: i + 1 },
      create: { name, slug, active: true, sortOrder: i + 1 },
    });
  }

  for (const faq of INITIAL_FAQS) {
    const existing = await prisma.fAQ.findFirst({
      where: { question: faq.question },
    });
    if (!existing) {
      await prisma.fAQ.create({ data: faq });
    }
  }

  for (const content of SITE_CONTENT_SECTIONS) {
    await prisma.siteContent.upsert({
      where: {
        section_key: { section: content.section, key: content.key },
      },
      update: { value: content.value },
      create: {
        section: content.section,
        key: content.key,
        label: content.label,
        value: content.value,
        type: content.type ?? "TEXT",
      },
    });
  }

  await prisma.vaccineContent.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      title: "Vacunatorio pediátrico",
      description:
        "Vacunatorio pediátrico con aplicación de vacunas del Calendario Nacional y medicación inyectable indicada por profesionales.",
      calendarVaccines:
        "Aplicamos vacunas del Calendario Nacional según edad y normativa vigente.",
      injectablesInfo:
        "Aplicación de medicación inyectable indicada por profesionales de la salud.",
      requirements:
        "Documentación del niño/a, carnet de vacunación, credencial de obra social si corresponde.",
      schedules: "Consultar horarios actualizados por WhatsApp.",
      active: true,
    },
  });

  console.log("✅ Seed completado.");
  console.log("⚠️  Admin: admin@clinicadelnino.com / admin123456");
  console.log("⚠️  Cambiar contraseña antes de publicar en producción.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
