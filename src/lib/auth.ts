import {
  type SessionPayload,
  authCookie,
  createSessionToken,
  verifySessionToken,
  COOKIE_NAME,
  SESSION_MAX_AGE,
} from "@/lib/auth-jwt";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export type { SessionPayload };
export {
  authCookie,
  createSessionToken,
  verifySessionToken,
  COOKIE_NAME,
  SESSION_MAX_AGE,
};

export async function authenticateUser(
  email: string,
  password: string
): Promise<SessionPayload | null> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return null;

  return {
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}
