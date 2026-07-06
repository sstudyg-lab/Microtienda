"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import TarjetaHerramienta from "@/components/TarjetaHerramienta";

export default function Biblioteca() {
  const [usuario, setUsuario] = useState(undefined);
  const [herramientas, setHerramientas] = useState([]);

  useEffect(() => {
    async function cargar() {
      const { data: u } = await supabase.auth.getUser();
      setUsuario(u.user);
      if (!u.user) return;

      const { data } = await supabase
        .from("descargas")
        .select("herramientas(*)")
        .eq("usuario_id", u.user.id)
        .order("creado", { ascending: false });

      setHerramientas((data || []).map((d) => ({ ...d.herramientas, rating: 0, num_valoraciones: 0 })));
    }
    cargar();
  }, []);

  if (usuario === undefined) return <p className="meta">Cargando…</p>;

  if (!usuario) {
    return (
      <div style={{ textAlign: "center", padding: "50px 0" }}>
        <p style={{ fontFamily: "var(--mono)", color: "var(--gris)" }}>Entra en tu cuenta para ver tu biblioteca.</p>
        <Link href="/cuenta" className="btn" style={{ display: "inline-block", marginTop: 10 }}>
          Entrar o crear cuenta
        </Link>
      </div>
    );
  }

  return (
    <>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Mi biblioteca</h1>
      <p style={{ fontSize: 13, color: "var(--gris)", marginTop: 0 }}>
        Herramientas que has descargado. Siempre disponibles aquí.
      </p>
      {herramientas.length === 0 ? (
        <div style={{ textAlign: "center", padding: "50px 0" }}>
          <p style={{ fontFamily: "var(--mono)", color: "var(--gris)" }}>Tu biblioteca está vacía.</p>
          <Link href="/" style={{ color: "var(--verde)", textDecoration: "underline", fontSize: 13 }}>
            Explorar herramientas
          </Link>
        </div>
      ) : (
        <div className="cuadricula">
          {herramientas.map((h) => (
            <TarjetaHerramienta key={h.id} h={h} />
          ))}
        </div>
      )}
    </>
  );
}
