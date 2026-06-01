import { getSession } from "@/lib/session";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <div className="min-h-screen bg-surface-soft">
      {session && (
        <div className="border-b border-medical-blue/5 bg-white px-4 py-2 text-center text-xs text-text-muted md:hidden">
          Sesión: {session.name}
        </div>
      )}
      {children}
    </div>
  );
}
