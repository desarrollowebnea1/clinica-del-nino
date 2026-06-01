import { inter, plusJakarta } from "@/lib/fonts";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Clínica del Niño | Atención pediátrica 24 horas",
    template: "%s | Clínica del Niño",
  },
  description:
    "Clínica pediátrica en Corrientes Capital. Guardia 24/7, internación, vacunatorio, neonatología, terapia intensiva y más de 80 obras sociales.",
  keywords: [
    "clínica pediátrica",
    "Corrientes",
    "guardia pediátrica 24 horas",
    "vacunatorio",
    "internación pediátrica",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-AR" className={`${inter.variable} ${plusJakarta.variable}`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
