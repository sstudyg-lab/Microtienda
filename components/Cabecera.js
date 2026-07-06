"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const enlaces = [
  { href: "/", texto: "Explorar" },
  { href: "/publicar", texto: "Publicar" },
  { href: "/biblioteca", texto: "Mi biblioteca" },
];

export default function Cabecera() {
  const ruta = usePathname();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUsuario(data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, sesion) => {
      setUsuario(sesion?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <header
      style={{
        borderBottom: "1px solid var(--linea)",
        background: "var(--tarjeta)",
        position: "sticky",
        top: 0,
        zIndex: 40,
      }}
    >
      <div
        className="contenedor"
        style={{ padding: "14px 20px", display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}
      >
        <Link href="/" style={{ fontFamily: "var(--mono)", fontWeight: 800, fontSize: 17 }}>
          micro<span style={{ color: "var(--verde)" }}>tienda</span>
          <span style={{ color: "var(--ambar)" }}>_</span>
        </Link>
        <nav style={{ display: "flex", gap: 18, flex: 1 }}>
          {enlaces.map((e) => (
            <Link
              key={e.href}
              href={e.href}
              style={{
                fontFamily: "var(--mono)",
                fontSize: 13,
                fontWeight: ruta === e.href ? 700 : 400,
                color: ruta === e.href ? "var(--verde)" : "var(--gris)",
                borderBottom: ruta === e.href ? "2px solid var(--verde)" : "2px solid transparent",
                padding: "6px 2px",
              }}
            >
              {e.texto}
            </Link>
          ))}
        </nav>
        <Link
          href="/cuenta"
          style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--verde)", fontWeight: 700 }}
        >
          {usuario ? "Mi cuenta" : "Entrar / Registrarse"}
        </Link>
      </div>
    </header>
  );
}
