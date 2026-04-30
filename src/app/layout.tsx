import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

export const metadata: Metadata = {
  title: {
    default: "Escapamex | Experiencias y Viajes Inolvidables en México",
    template: "%s | Escapamex"
  },
  description:
    "Descubre las mejores experiencias y viajes en México con Escapamex. Tours personalizados, aventuras únicas y escapadas inolvidables en destinos como Tulum, Oaxaca y más.",
  keywords: [
    "viajes en México",
    "experiencias turísticas México",
    "tours en México",
    "viajes personalizados México",
    "escapadas México",
    "turismo en México",
    "experiencias en Tulum",
    "viajes a Oaxaca",
    "paquetes turísticos México",
    "Escapamex"
  ],
  authors: [{ name: "Escapamex" }],
  creator: "Escapamex",
  publisher: "Escapamex",
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // No definimos lang aquí porque lo hará el layout dinámico
    <html suppressHydrationWarning>
      <head>
        <Script crossOrigin="anonymous" src="//unpkg.com/same-runtime/dist/index.global.js" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}