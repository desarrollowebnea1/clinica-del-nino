import { prisma } from "@/lib/prisma";

export async function getClinicSettings() {
  return prisma.clinicSettings.findUnique({ where: { id: "default" } });
}

export async function getActiveServices() {
  return prisma.service.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getActiveInsurance() {
  return prisma.insuranceProvider.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getActiveFaqs() {
  return prisma.fAQ.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getVaccineContent() {
  return prisma.vaccineContent.findUnique({
    where: { id: "default", active: true },
  });
}

export async function getSiteContentBySection(section: string) {
  const items = await prisma.siteContent.findMany({
    where: { section },
    orderBy: { sortOrder: "asc" },
  });

  return items.reduce(
    (acc, item) => {
      let value: unknown = item.value;
      if (item.type === "JSON") {
        try {
          value = JSON.parse(item.value);
        } catch {
          value = item.value;
        }
      }
      acc[item.key] = value;
      return acc;
    },
    {} as Record<string, unknown>
  );
}
