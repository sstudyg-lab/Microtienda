"use client";

import Link from "next/link";

export function PillPrecio({ herramienta, grande = false }) {
  const esGratis = herramienta.gratis || Number(herramienta.precio) === 0;
  return (
    <span
      className={`precio-pill ${esGratis ? "precio-gratis" : "precio-pago"}`}
      style={grande ? { fontSize: 22, padding: "6px 14px" } : undefined}
    >
      {esGratis ? "GRATIS" : `${Number(herramienta.precio).toFixed(2)} €`}
    </span>
  );
}

export function Estrellas({ valor }) {
  const llenas = Math.round(valor || 0);
  return (
    <span style={{ color: "var(--ambar)", fontSize: 13, letterSpacing: 1 }}>
      {"★".repeat(llenas)}
      <span style={{ color: "var(--linea)" }}>{"★".repeat(5 - llenas)}</span>
    </span>
  );
}

export default function TarjetaHerramienta({ h }) {
  return (
    <Link href={`/herramienta/${h.id}`} className="tarjeta">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "8px 14px",
          borderBottom: "1px solid var(--linea)",
          background: "var(--papel)",
        }}
      >
        <span className="meta">
          {h.categoria.toUpperCase()} · {h.tipo}
        </span>
      </div>
      <div style={{ padding: 16, flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "baseline" }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{h.nombre}</h3>
          <PillPrecio herramienta={h} />
        </div>
        <p
          style={{
            margin: "8px 0 12px",
            fontSize: 13,
            color: "var(--gris)",
            lineHeight: 1.5,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {h.descripcion}
        </p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>
            <Estrellas valor={h.rating} />{" "}
            <span className="meta">{h.num_valoraciones ? `${h.rating.toFixed(1)} (${h.num_valoraciones})` : "sin valorar"}</span>
          </span>
          <span className="meta">{h.descargas.toLocaleString("es-ES")} descargas</span>
        </div>
      </div>
    </Link>
  );
}
