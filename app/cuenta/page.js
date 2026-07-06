"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Cuenta() {
  const router = useRouter();
  const [usuario, setUsuario] = useState(undefined);
  const [modo, setModo] = useState("entrar"); // entrar | registro
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [clave, setClave] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [aviso, setAviso] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUsuario(data.user));
  }, []);

  async function enviar() {
    setEnviando(true);
    setAviso(null);

    if (modo === "registro") {
      const { error } = await supabase.auth.signUp({
        email,
        password: clave,
        options: { data: { nombre: nombre.trim() } },
      });
      if (error) {
        setAviso({ texto: error.message, error: true });
      } else {
        setAviso({
          texto: "Cuenta creada. Si tu proyecto tiene confirmación por email activada, revisa tu correo antes de entrar.",
        });
        setModo("entrar");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password: clave });
      if (error) {
        setAviso({ texto: "Email o contraseña incorrectos.", error: true });
      } else {
        router.push("/");
        return;
      }
    }
    setEnviando(false);
  }

  async function salir() {
    await supabase.auth.signOut();
    setUsuario(null);
  }

  if (usuario === undefined) return <p className="meta">Cargando…</p>;

  if (usuario) {
    return (
      <div style={{ maxWidth: 420, margin: "0 auto", textAlign: "center" }}>
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>Mi cuenta</h1>
        <p className="meta">{usuario.email}</p>
        <button onClick={salir} className="btn btn-secundario" style={{ marginTop: 16 }}>
          Cerrar sesión
        </button>
      </div>
    );
  }

  const valido = email.includes("@") && clave.length >= 6 && (modo === "entrar" || nombre.trim().length >= 2);

  return (
    <div style={{ maxWidth: 420, margin: "0 auto" }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>
        {modo === "entrar" ? "Entrar" : "Crear cuenta"}
      </h1>

      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        <button onClick={() => setModo("entrar")} className={`chip ${modo === "entrar" ? "activo" : ""}`}>
          Ya tengo cuenta
        </button>
        <button onClick={() => setModo("registro")} className={`chip ${modo === "registro" ? "activo" : ""}`}>
          Soy nuevo
        </button>
      </div>

      <div className="tarjeta" style={{ padding: 22, display: "grid", gap: 14 }}>
        {modo === "registro" && (
          <div>
            <label className="etiqueta" htmlFor="nombre">Nombre de usuario</label>
            <input id="nombre" className="campo" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="tu_nombre" />
          </div>
        )}
        <div>
          <label className="etiqueta" htmlFor="email">Email</label>
          <input id="email" type="email" className="campo" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" />
        </div>
        <div>
          <label className="etiqueta" htmlFor="clave">Contraseña (mínimo 6 caracteres)</label>
          <input id="clave" type="password" className="campo" value={clave} onChange={(e) => setClave(e.target.value)} />
        </div>
        <button onClick={enviar} disabled={!valido || enviando} className="btn btn-bloque">
          {enviando ? "Un momento…" : modo === "entrar" ? "Entrar" : "Crear cuenta"}
        </button>
        {aviso && <p className={`aviso ${aviso.error ? "error" : ""}`}>{aviso.texto}</p>}
      </div>
    </div>
  );
}
