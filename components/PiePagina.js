import Link from "next/link";

export default function PiePagina() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--linea)",
        background: "var(--tarjeta)",
        marginTop: 40,
      }}
    >
      <div
        className="contenedor"
        style={{
          padding: "20px",
          display: "flex",
          gap: 18,
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span className="meta">
          © {new Date().getFullYear()} microtienda_
        </span>
        <nav style={{ display: "flex", gap: 18 }}>
          <Link href="/privacidad" className="meta">
            Privacidad
          </Link>
          <Link href="/aviso-legal" className="meta">
            Aviso legal
          </Link>
        </nav>
      </div>
    </footer>
  );
}
