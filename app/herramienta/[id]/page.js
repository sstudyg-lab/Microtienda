"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { PillPrecio, Estrellas } from "@/components/TarjetaHerramienta";

export default function DetalleHerramienta() {
  const { id } = useParams();
  const router = useRouter();
  const [h, setH] = useState(null);
  const [valoraciones, setValoraciones] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [enBiblioteca, setEnBiblioteca] = useState(false);
  const [aviso, setAviso] = useState("");
  const [miPuntuacion, setMiPuntuacion] = useState(5);
  const [miComentario, setMiComentario] = useState("");

  useEffect(() => {
    async function cargar() {
      const { data: herramienta } = await supabase.from("herramientas").select("*, perfiles(nombre)").eq("id", id).single();
      setH(herramienta);

      const { data: vals } = await supabase
        .from("valoraciones")
        .select("*, perfiles(nombre)")
        .eq("herramienta_id", id)
        .order("creado", { ascending: false });
      setValoraciones(vals || []);

      const { data: u } = await supabase.auth.getUser();
      setUsuario(u.user);
      if (u.user) {
        const { data: d } = await supabase
          .from("descargas")
          .select("herramienta_id")
          .eq("usuario_id", u.user.id)
          .eq("herramienta_id", id)
          .maybeSingle();
        setEnBiblioteca(!!d);
      }
    }
    cargar();
  }, [id]);

  async function descargar() {
    if (!usuario) {
      router.push("/cuenta");
      return;
    }
    const { error } = await supabase.rpc("registrar_descarga", { h: id });
    if (error) {
      setAviso("No se pudo registrar la descarga. Inténtalo de nuevo.");
      return;
    }
    setEnBiblioteca(true);
    setAviso("✓ Añadida a tu biblioteca");
    // Abrir el archivo o el enlace web de la herramienta
    const destino = h.archivo_url || h.enlace_web;
    if (destino) window.open(destino, "_blank");
  }

  async function enviarValoracion() {
    const { error } = await supabase.from("valoraciones").upsert({
      usuario_id: usuario.id,
      herramienta_id: id,
      puntuacion: miPuntuacion,
      comentario: miComentario.trim() || null,
    });
    if (error) {
      setAviso("No se pudo guardar tu valoración.");
      return;
    }
    setAviso("✓ Valoración publicada");
    setMiComentario("");
    const { data: vals } = await supabase
      .from("valoraciones")
      .select("*, perfiles(nombre)")
      .eq("herramienta_id", id)
      .order("creado", { ascending: false });
    setValoraciones(vals || []);
  }

  if (!h) return <p className="meta">Cargando…</p>;

  const media = valoraciones.length
    ? valoraciones.reduce((s, v) => s + v.puntuacion, 0) / valoraciones.length
    : 0;
  const yaValore = usuario && valoraciones.some((v) => v.usuario_id === usuario.id);

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      <p className="meta">
        {h.categoria.toUpperCase()} · {h.tipo} · v{h.version} · publicado{" "}
        {new Date(h.creado).toLocaleDateString("es-ES")}
      </p>

      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", flexWrap: "wrap", marginTop: 8 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800 }}>{h.nombre}</h1>
          <span className="meta">por @{h.perfiles?.nombre || "desconocido"}</span>
        </div>
        <PillPrecio herramienta={h} grande />
      </div>

      <p style={{ fontSize: 15, lineHeight: 1.6, marginTop: 14, whiteSpace: "pre-line" }}>{h.descripcion}</p>

      {h.capturas?.length > 0 && (
        <div style={{ display: "flex", gap: 10, marginTop: 6, flexWrap: "wrap" }}>
          {h.capturas.map((url, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={url}
              alt={`Captura ${i + 1} de ${h.nombre}`}
              style={{ maxWidth: 220, borderRadius: 8, border: "1px solid var(--linea)" }}
            />
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: 16, marginTop: 16, flexWrap: "wrap", alignItems: "center" }}>
        <span>
          <Estrellas valor={media} />{" "}
          <span className="meta">
            {valoraciones.length ? `${media.toFixed(1)} · ${valoraciones.length} valoraciones` : "sin valoraciones"}
          </span>
        </span>
        <span className="meta">{h.descargas.toLocaleString("es-ES")} descargas</span>
        {h.etiquetas?.length > 0 && <span className="meta">etiquetas: {h.etiquetas.join(", ")}</span>}
      </div>

      <button onClick={descargar} className="btn btn-bloque" style={{ marginTop: 20 }}>
        {enBiblioteca
          ? h.tipo === "Herramienta web"
            ? "Abrir herramienta"
            : "Descargar de nuevo"
          : usuario
          ? h.tipo === "Herramienta web"
            ? "Usar gratis"
            : "Descargar gratis"
          : "Entra para descargar gratis"}
      </button>

      {aviso && <p className="aviso" style={{ marginTop: 12 }}>{aviso}</p>}

      <h2 style={{ fontSize: 14, fontFamily: "var(--mono)", color: "var(--gris)", marginTop: 32, textTransform: "uppercase", letterSpacing: 1 }}>
        Opiniones
      </h2>

      {usuario && enBiblioteca && !yaValore && (
        <div className="tarjeta" style={{ padding: 16, marginBottom: 16 }}>
          <label className="etiqueta">Tu puntuación</label>
          <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => setMiPuntuacion(n)}
                aria-label={`${n} estrellas`}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 22,
                  color: n <= miPuntuacion ? "var(--ambar)" : "var(--linea)",
                }}
              >
                ★
              </button>
            ))}
          </div>
          <textarea
            className="campo"
            placeholder="Cuenta tu experiencia (opcional)"
            value={miComentario}
            onChange={(e) => setMiComentario(e.target.value)}
            style={{ minHeight: 60, resize: "vertical", marginBottom: 10 }}
          />
          <button onClick={enviarValoracion} className="btn">
            Publicar valoración
          </button>
        </div>
      )}

      {valoraciones.length === 0 && <p className="meta">Todavía no hay opiniones.</p>}
      {valoraciones.map((v) => (
        <div key={v.usuario_id} style={{ borderTop: "1px solid var(--linea)", padding: "10px 0" }}>
          <Estrellas valor={v.puntuacion} /> <span className="meta">@{v.perfiles?.nombre || "usuario"}</span>
          {v.comentario && <p style={{ margin: "4px 0 0", fontSize: 13 }}>{v.comentario}</p>}
        </div>
      ))}
    </div>
  );
}
