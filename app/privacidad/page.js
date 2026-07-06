export const metadata = {
  title: "Política de privacidad | microtienda_",
};

// ⚠️ ANTES DE PUBLICAR: sustituye [TU NOMBRE] y [TU EMAIL] por tus datos reales.
const NOMBRE = "Ignacio";
const EMAIL = "infomicrotienda@gmail.com";
const WEB = "microtienda";

export default function Privacidad() {
  return (
    <article style={{ maxWidth: 720, margin: "0 auto", lineHeight: 1.7 }}>
      <h1 style={{ fontSize: 26, fontWeight: 800 }}>Política de privacidad</h1>
      <p className="meta">Última actualización: {new Date().toLocaleDateString("es-ES")}</p>

      <h2 style={estiloH2}>1. Responsable del tratamiento</h2>
      <p>
        El responsable del tratamiento de tus datos personales es {NOMBRE}, titular de {WEB} (en
        adelante, "la plataforma"). Para cualquier consulta relacionada con tus datos, puedes
        escribir a <strong>{EMAIL}</strong>.
      </p>

      <h2 style={estiloH2}>2. Qué datos recogemos</h2>
      <p>Cuando usas la plataforma podemos tratar los siguientes datos:</p>
      <ul>
        <li>Datos de registro: nombre de usuario, dirección de correo electrónico y contraseña (almacenada de forma cifrada).</li>
        <li>Contenido que publicas: herramientas que subes, descripciones, capturas, archivos, valoraciones y comentarios.</li>
        <li>Datos de uso: herramientas que descargas, con el fin de mostrarte tu biblioteca.</li>
      </ul>

      <h2 style={estiloH2}>3. Con qué finalidad y base legal</h2>
      <p>
        Tratamos tus datos para permitirte crear una cuenta, iniciar sesión, publicar y descargar
        herramientas, y valorar el contenido. La base legal es la ejecución del servicio que
        solicitas al registrarte (relación contractual) y tu consentimiento, que puedes retirar en
        cualquier momento eliminando tu cuenta.
      </p>

      <h2 style={estiloH2}>4. Dónde se guardan tus datos</h2>
      <p>
        Los datos se almacenan a través de <strong>Supabase</strong>, proveedor de infraestructura
        que actúa como encargado del tratamiento, con servidores ubicados en la Unión Europea. La
        plataforma se sirve mediante <strong>Vercel</strong>. Ambos proveedores aplican medidas de
        seguridad conformes al RGPD.
      </p>

      <h2 style={estiloH2}>5. Cesión a terceros</h2>
      <p>
        No vendemos ni cedemos tus datos personales a terceros. Solo se comparten con los
        proveedores estrictamente necesarios para prestar el servicio (los mencionados en el punto
        anterior).
      </p>

      <h2 style={estiloH2}>6. Tus derechos</h2>
      <p>
        Tienes derecho a acceder a tus datos, rectificarlos, suprimirlos, limitar u oponerte a su
        tratamiento y a la portabilidad de los mismos. Para ejercerlos, escribe a{" "}
        <strong>{EMAIL}</strong>. También puedes eliminar tu cuenta en cualquier momento, lo que
        borrará tus datos de perfil y el contenido asociado. Si consideras que no hemos atendido
        correctamente tu solicitud, puedes presentar una reclamación ante la Agencia Española de
        Protección de Datos (www.aepd.es).
      </p>

      <h2 style={estiloH2}>7. Conservación</h2>
      <p>
        Conservamos tus datos mientras mantengas tu cuenta activa. Cuando la elimines, se borrarán
        salvo aquellos que debamos conservar por obligación legal.
      </p>

      <h2 style={estiloH2}>8. Cambios en esta política</h2>
      <p>
        Podemos actualizar esta política para adaptarla a cambios legales o del servicio.
        Publicaremos siempre la versión vigente en esta misma página.
      </p>
    </article>
  );
}

const estiloH2 = { fontSize: 17, fontWeight: 700, marginTop: 28 };
