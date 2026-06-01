import { getSession } from "@/lib/session";
import { apiError } from "@/lib/api";

export async function requireAdminSession() {
  const session = await getSession();
  if (!session) {
    return { session: null, error: apiError("No autorizado", 401) };
  }
  return { session, error: null };
}
