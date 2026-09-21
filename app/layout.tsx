import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Plan Chevrolet | Accedé a tu 0 km",
    template: "%s | Plan Chevrolet",
  },
  description:
    "Suscribite al Plan Chevrolet y financiá tu 0 km. Consultá por Sonic, Onix, Tracker, Montana y S10.",
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  openGraph: {
    title: "Plan Chevrolet | Accedé a tu 0 km",
    description:
      "Formá parte de un plan de ahorro en pesos y llegá a tu Chevrolet 0 km.",
    locale: "es_AR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full">
      <body className="min-h-full font-sans antialiased">{children}</body>
    </html>
  );
}
