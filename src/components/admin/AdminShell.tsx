"use client";

import { ClinicLogo } from "@/components/brand/ClinicLogo";
import { cn } from "@/lib/utils";
import {
  Building2,
  FileText,
  HelpCircle,
  Image,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  Shield,
  Syringe,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/inquiries", label: "Solicitudes", icon: MessageSquare },
  { href: "/admin/services", label: "Servicios", icon: Building2 },
  { href: "/admin/insurance", label: "Obras sociales", icon: Shield },
  { href: "/admin/vaccine", label: "Vacunatorio", icon: Syringe },
  { href: "/admin/faqs", label: "FAQ", icon: HelpCircle },
  { href: "/admin/content", label: "Contenido", icon: FileText },
  { href: "/admin/images", label: "Imágenes", icon: Image },
  { href: "/admin/settings", label: "Configuración", icon: Settings },
];

export function AdminShell({
  children,
  userName,
}: {
  children: React.ReactNode;
  userName: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const NavContent = () => (
    <>
      <div className="border-b border-medical-blue/5 px-4 py-5">
        <ClinicLogo variant="compact" className="max-w-[200px]" />
        <p className="mt-2 text-xs text-text-muted">Panel admin · {userName}</p>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setDrawerOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition",
                active
                  ? "bg-medical-blue text-white"
                  : "text-text-muted hover:bg-medical-sky/60 hover:text-medical-blue"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-medical-blue/5 p-3">
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-medical-coral hover:bg-medical-coral/10"
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-medical-blue/5 bg-white lg:flex">
        <NavContent />
      </aside>

      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-medical-blue/30 lg:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white shadow-float transition-transform lg:hidden",
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <button
          type="button"
          className="absolute right-3 top-4 rounded-lg p-2"
          onClick={() => setDrawerOpen(false)}
        >
          <X className="h-5 w-5" />
        </button>
        <NavContent />
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center gap-3 border-b border-medical-blue/5 bg-white px-4 lg:hidden">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="rounded-xl border border-medical-blue/10 p-2"
          >
            <Menu className="h-5 w-5" />
          </button>
          <ClinicLogo variant="mark" className="h-8 w-8" />
          <span className="sr-only">Panel admin Clínica del Niño</span>
        </header>
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
