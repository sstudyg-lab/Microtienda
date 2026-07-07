import "./globals.css";
import Cabecera from "@/components/Cabecera";
import PiePagina from "@/components/PiePagina";
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  title: "microtienda_ | Microprogramas para tareas concretas",
  description:
    "Encuentra o publica pequeñas herramientas que resuelven una tarea concreta: convertir PDFs, renombrar archivos, limpiar CSVs y mucho más.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Cabecera />
        <main className="contenedor" style={{ padding: "28px 20px 60px", flex: 1 }}>
          {children}
        </main>
        <PiePagina />
        <Analytics />
      </body>
    </html>
  );
}