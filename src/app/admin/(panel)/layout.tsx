import { AdminShell } from "@/components/admin/AdminShell";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return <AdminShell userName={session.name}>{children}</AdminShell>;
}
