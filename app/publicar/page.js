"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase, CATEGORIAS, TIPOS } from "@/lib/supabase";

export default function Publicar() {
  const router = useRouter();
  const [usuario, setUsuario] = useState(undefined); // undefined = comprobando
  const [f, setF] = useState({
    nombre: "",
    descripcion: "",
    categoria: CATEGORIAS[0],
    tipo: TIPOS[0],
    etiquetas: "",
    enlace_web: "",
  });
  const [archivo, setArchivo] = useState(null);
  const [capturas, setCapturas] = useState([]);
  const [enviando, setEnviando] = useState(false);
  const [aviso, setAviso] = useState(null); // { texto, error }

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUsuario(data.user));
  }, []);

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const esWeb = f.tipo === "Herramienta web" || f.tipo === "API";
  const valido =
    f.nombre.trim().length >= 3 &&
    f.descripcion.trim().length >= 20 &&
    (esWeb ? f.enlace_web.trim().startsWith("http") : !!archivo);

  async function subirArchivo(bucket, file) {
    const nombreLimpio = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const ruta = `${usuario.id}/${Date.now()}-${nombreLimpio}`;
    const { error } = await supabase.storage.from(bucket).upload(ruta, file);
    if (error) throw error;
    return supabase.storage.from(bucket).getPublicUrl(ruta).data.publicUrl;
  }

  async function publicar() {
    setEnviando(true);
    setAviso(null);
    try {
      let archivo_url = null;
      if (!esWeb && archivo) archivo_url = await subirArchivo("archivos", archivo);

      const urlsCapturas = [];
      for (const c of capturas.slice(0, 3)) {
        urlsCapturas.push(await subirArchivo("capturas", c));
      }

      const { data, error } = await supabase
        .from("herramientas")
        .insert({
          dev_id: usuario.id,
          nombre: f.nombre.trim(),
          descripcion: f.descripcion.trim(),
          categoria: f.categoria,
          tipo: f.tipo,
          etiquetas: f.etiquetas.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean),
          gratis: true, // durante el lanzamiento todo es gratuito
          precio: 0,
          archivo_url,
          enlace_web: esWeb ? f.enlace_web.trim() : null,
          capturas: urlsCapturas,
        })
        .select()
        .single();

      if (error) throw error;
      router.push(`/herramienta/${data.id}`);
    } catch (e) {
      setAviso({ texto: `No se pudo publicar: ${e.message}`, error: true });
      setEnviando(false);
    }
  }

  if (usuario === undefined) return <p className="meta">Cargando…</p>;

  if (!usuario) {
    return (
      <div style={{ textAlign: "center", padding: "50px 0" }}>
        <p style={{ fontFamily: "var(--mono)", color: "var(--gris)" }}>
          Necesitas una cuenta para publicar herramientas.
        </p>
        <Link href="/cuenta" className="btn" style={{ display: "inline-block", marginTop: 10 }}>
          Entrar o crear cuenta
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Publica tu microprograma</h1>
      <p style={{ fontSize: 13, color: "var(--gris)", marginTop: 0 }}>
        Durante el lanzamiento todas las herramientas se publican gratis. Pronto podrás ponerles precio y cobrar por
        cada venta.
      </p>

      <div className="tarjeta" style={{ padding: 22, display: "grid", gap: 16 }}>
        <div>
          <label className="etiqueta" htmlFor="nombre">Nombre</label>
          <input id="nombre" className="campo" value={f.nombre} onChange={set("nombre")} placeholder="Ej.: PDF → Imagen Turbo" />
        </div>

        <div>
          <label className="etiqueta" htmlFor="descripcion">Descripción (qué problema resuelve, mínimo 20 caracteres)</label>
          <textarea
            id="descripcion"
            className="campo"
            style={{ minHeight: 90, resize: "vertical" }}
            value={f.descripcion}
            onChange={set("descripcion")}
            placeholder="Convierte cientos de PDFs a imágenes PNG o JPG en un solo paso…"
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div>
            <label className="etiqueta" htmlFor="categoria">Categoría</label>
            <select id="categoria" className="campo" value={f.categoria} onChange={set("categoria")}>
              {CATEGORIAS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="etiqueta" htmlFor="tipo">Tipo</label>
            <select id="tipo" className="campo" value={f.tipo} onChange={set("tipo")}>
              {TIPOS.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="etiqueta" htmlFor="etiquetas">Etiquetas (separadas por comas)</label>
          <input id="etiquetas" className="campo" value={f.etiquetas} onChange={set("etiquetas")} placeholder="pdf, imágenes, convertir" />
        </div>

        {esWeb ? (
          <div>
            <label className="etiqueta" htmlFor="enlace">Enlace a tu herramienta (empieza por https://)</label>
            <input id="enlace" className="campo" value={f.enlace_web} onChange={set("enlace_web")} placeholder="https://miherramienta.com" />
          </div>
        ) : (
          <div>
            <label className="etiqueta" htmlFor="archivo">Archivo del programa (zip recomendado, máx. 50 MB)</label>
            <input id="archivo" type="file" className="campo" onChange={(e) => setArchivo(e.target.files[0] || null)} />
          </div>
        )}

        <div>
          <label className="etiqueta" htmlFor="capturas">Capturas de pantalla (hasta 3, opcional)</label>
          <input
            id="capturas"
            type="file"
            accept="image/*"
            multiple
            className="campo"
            onChange={(e) => setCapturas(Array.from(e.target.files))}
          />
        </div>

        <button onClick={publicar} disabled={!valido || enviando} className="btn btn-bloque">
          {enviando ? "Publicando…" : "Publicar en la tienda"}
        </button>
        {aviso && <p className={`aviso ${aviso.error ? "error" : ""}`}>{aviso.texto}</p>}
      </div>
    </div>
  );
}
