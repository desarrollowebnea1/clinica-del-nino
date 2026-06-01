import { PrismaClient } from "@prisma/client";
import type { Prisma } from "@prisma/client";

/**
 * Singleton PrismaClient para Next.js.
 * - Evita múltiples instancias en hot reload (dev).
 * - Reutiliza la misma instancia en invocaciones warm (serverless).
 * @see https://www.prisma.io/docs/guides/database/neon
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getPrismaLogLevels(): Prisma.LogLevel[] {
  if (process.env.PRISMA_LOG_QUERIES === "true") {
    return ["query", "error", "warn"];
  }
  if (process.env.NODE_ENV === "development") {
    return ["error", "warn"];
  }
  return ["error"];
}

function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    log: getPrismaLogLevels(),
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

globalForPrisma.prisma = prisma;
