import "./globals.css";
import Cabecera from "@/components/Cabecera";

export const metadata = {
  title: "microtienda_ | Microprogramas para tareas concretas",
  description:
    "Encuentra o publica pequeñas herramientas que resuelven una tarea concreta: convertir PDFs, renombrar archivos, limpiar CSVs y mucho más.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Cabecera />
        <main className="contenedor" style={{ padding: "28px 20px 60px" }}>
          {children}
        </main>
      </body>
    </html>
  );
}
