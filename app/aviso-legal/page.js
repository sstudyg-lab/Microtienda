export const metadata = {
  title: "Aviso legal y condiciones de uso | microtienda_",
};

// ⚠️ ANTES DE PUBLICAR: sustituye [TU NOMBRE] y [TU EMAIL] por tus datos reales.
const NOMBRE = "Ignacio";
const EMAIL = "infomicrotienda@gmail.com";
const WEB = "microtienda";

export default function AvisoLegal() {
  return (
    <article style={{ maxWidth: 720, margin: "0 auto", lineHeight: 1.7 }}>
      <h1 style={{ fontSize: 26, fontWeight: 800 }}>Aviso legal y condiciones de uso</h1>
      <p className="meta">Última actualización: {new Date().toLocaleDateString("es-ES")}</p>

      <h2 style={estiloH2}>1. Titularidad</h2>
      <p>
        Este sitio web ({WEB}) es titularidad de {NOMBRE}. Para cualquier comunicación puedes
        dirigirte a <strong>{EMAIL}</strong>.
      </p>

      <h2 style={estiloH2}>2. Objeto</h2>
      <p>
        La plataforma es un espacio donde los usuarios pueden publicar y descargar pequeñas
        herramientas y programas. Actuamos como intermediarios: no somos autores del contenido que
        suben los usuarios ni garantizamos su funcionamiento.
      </p>

      <h2 style={estiloH2}>3. Registro y cuentas</h2>
      <p>
        Para publicar o descargar herramientas es necesario registrarse. Eres responsable de
        mantener la confidencialidad de tu contraseña y de toda la actividad que se realice desde tu
        cuenta. Debes ser mayor de edad o contar con el consentimiento de tus responsables legales.
      </p>

      <h2 style={estiloH2}>4. Obligaciones de quien publica</h2>
      <p>Al publicar una herramienta, te comprometes a que:</p>
      <ul>
        <li>Eres el autor o tienes derecho a distribuirla.</li>
        <li>No contiene software malicioso, virus ni código diseñado para dañar a otros usuarios.</li>
        <li>No infringe derechos de terceros ni la legislación vigente.</li>
      </ul>
      <p>
        Nos reservamos el derecho de retirar cualquier herramienta que incumpla estas condiciones o
        que resulte sospechosa, sin previo aviso.
      </p>

      <h2 style={estiloH2}>5. Responsabilidad sobre las descargas</h2>
      <p>
        El contenido lo suben los propios usuarios. Aunque procuramos revisar lo publicado, no
        podemos garantizar la total seguridad ni el correcto funcionamiento de cada herramienta. Las
        descargas se realizan bajo tu propia responsabilidad; te recomendamos analizar los archivos
        con un antivirus antes de ejecutarlos.
      </p>

      <h2 style={estiloH2}>6. Propiedad intelectual</h2>
      <p>
        Cada herramienta pertenece a su autor. El resto de elementos de la plataforma (diseño,
        estructura y código propio) pertenecen a su titular. No está permitido reproducirlos sin
        autorización.
      </p>

      <h2 style={estiloH2}>7. Limitación de responsabilidad</h2>
      <p>
        La plataforma se ofrece "tal cual". No nos responsabilizamos de los daños que pudieran
        derivarse del uso de las herramientas publicadas por terceros, de interrupciones del
        servicio ni de errores ajenos a nuestro control.
      </p>

      <h2 style={estiloH2}>8. Legislación aplicable</h2>
      <p>
        Estas condiciones se rigen por la legislación española. Para cualquier controversia, las
        partes se someten a los juzgados y tribunales que correspondan conforme a la ley.
      </p>
    </article>
  );
}

const estiloH2 = { fontSize: 17, fontWeight: 700, marginTop: 28 };
