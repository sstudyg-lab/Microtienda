"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase, CATEGORIAS } from "@/lib/supabase";
import TarjetaHerramienta from "@/components/TarjetaHerramienta";

export default function Explorar() {
  const [herramientas, setHerramientas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("Todas");
  const [orden, setOrden] = useState("recientes");

  useEffect(() => {
    async function cargar() {
      // Herramientas + media de valoraciones
      const { data: hs } = await supabase
        .from("herramientas")
        .select("*")
        .order("creado", { ascending: false });
      const { data: vals } = await supabase.from("valoraciones").select("herramienta_id, puntuacion");

      const medias = {};
      (vals || []).forEach((v) => {
        medias[v.herramienta_id] = medias[v.herramienta_id] || { suma: 0, n: 0 };
        medias[v.herramienta_id].suma += v.puntuacion;
        medias[v.herramienta_id].n += 1;
      });

      setHerramientas(
        (hs || []).map((h) => ({
          ...h,
          rating: medias[h.id] ? medias[h.id].suma / medias[h.id].n : 0,
          num_valoraciones: medias[h.id]?.n || 0,
        }))
      );
      setCargando(false);
    }
    cargar();
  }, []);

  const resultados = useMemo(() => {
    const terminos = q.toLowerCase().split(/\s+/).filter((t) => t.length > 2);
    let r = herramientas.filter((h) => {
      if (cat !== "Todas" && h.categoria !== cat) return false;
      if (terminos.length === 0) return true;
      const texto = `${h.nombre} ${h.descripcion} ${h.categoria} ${h.tipo} ${(h.etiquetas || []).join(" ")}`.toLowerCase();
      return terminos.some((t) => texto.includes(t));
    });
    if (orden === "rating") r = [...r].sort((a, b) => b.rating - a.rating);
    if (orden === "descargas") r = [...r].sort((a, b) => b.descargas - a.descargas);
    return r;
  }, [q, cat, orden, herramientas]);

  return (
    <>
      <section style={{ marginBottom: 26 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, margin: "0 0 4px" }}>Una herramienta. Una tarea. Listo.</h1>
        <p style={{ color: "var(--gris)", fontSize: 14, margin: "0 0 14px" }}>
          Describe lo que necesitas y encuentra el microprograma exacto. Todo gratis durante el lanzamiento.
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "var(--tinta)",
            borderRadius: 10,
            padding: "14px 16px",
          }}
        >
          <span style={{ fontFamily: "var(--mono)", color: "var(--verde)", fontWeight: 700 }}>&gt;</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="necesito convertir 300 pdfs en imágenes…"
            aria-label="Buscar herramientas"
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#eaf2ec",
              fontFamily: "var(--mono)",
              fontSize: 15,
            }}
          />
          {q && (
            <button
              onClick={() => setQ("")}
              style={{ background: "none", border: "none", color: "var(--gris)", cursor: "pointer", fontFamily: "var(--mono)" }}
            >
              limpiar
            </button>
          )}
        </div>
      </section>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 20 }}>
        {["Todas", ...CATEGORIAS].map((c) => (
          <button key={c} onClick={() => setCat(c)} className={`chip ${cat === c ? "activo" : ""}`}>
            {c}
          </button>
        ))}
        <span style={{ flex: 1 }} />
        <select
          value={orden}
          onChange={(e) => setOrden(e.target.value)}
          className="campo"
          style={{ width: "auto", fontFamily: "var(--mono)", fontSize: 12, padding: "5px 8px" }}
        >
          <option value="recientes">más recientes</option>
          <option value="rating">mejor valoradas</option>
          <option value="descargas">más descargadas</option>
        </select>
      </div>

      {cargando ? (
        <p className="meta">Cargando herramientas…</p>
      ) : resultados.length === 0 ? (
        <div style={{ textAlign: "center", padding: "50px 0" }}>
          <p style={{ fontFamily: "var(--mono)", color: "var(--gris)" }}>
            {herramientas.length === 0 ? "Todavía no hay herramientas publicadas." : "Sin resultados para esa búsqueda."}
          </p>
          <Link href="/publicar" style={{ color: "var(--verde)", textDecoration: "underline", fontSize: 13 }}>
            Sé quien publique la primera
          </Link>
        </div>
      ) : (
        <div className="cuadricula">
          {resultados.map((h) => (
            <TarjetaHerramienta key={h.id} h={h} />
          ))}
        </div>
      )}
    </>
  );
}
