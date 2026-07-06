# microtienda_ — Marketplace de microprogramas

Aplicación web de producción construida con **Next.js** y **Supabase**. En esta primera versión todas las herramientas son **gratuitas**; el modelo de datos ya incluye los campos `gratis` y `precio` para activar ventas de pago en el futuro sin cambiar la base de datos.

## Qué incluye

- Explorar con buscador en lenguaje natural, filtros por categoría y ordenación.
- Ficha de cada herramienta con capturas, valoraciones, opiniones y contador de descargas.
- Cuentas de usuario (registro e inicio de sesión con email y contraseña).
- Publicación de herramientas con subida real de archivos y capturas de pantalla.
- Biblioteca personal con lo que has descargado.
- Sistema de valoraciones (1 a 5 estrellas + comentario), una por usuario y herramienta.

## Puesta en producción, paso a paso

### 1. Crea el proyecto en Supabase (base de datos, cuentas y archivos — gratis)

1. Entra en https://supabase.com y crea una cuenta.
2. Pulsa **New project**, dale un nombre (p. ej. `microtienda`), elige una contraseña de base de datos y la región **West EU** (la más cercana a España).
3. Cuando termine de crearse, ve a **SQL Editor** (icono de terminal en el menú lateral), pega **todo** el contenido del archivo `supabase/schema.sql` y pulsa **Run**. Esto crea las tablas, la seguridad y el almacenamiento de archivos.
4. Ve a **Project Settings → API** y copia dos valores:
   - **Project URL** (algo como `https://abcdefg.supabase.co`)
   - **anon public key** (una clave larga)

> Opcional pero recomendado al principio: en **Authentication → Providers → Email**, desactiva "Confirm email" para que los usuarios puedan entrar nada más registrarse, sin esperar un correo de confirmación.

### 2. Prueba la app en tu ordenador

Necesitas tener instalado [Node.js](https://nodejs.org) (versión 18 o superior).

```bash
# dentro de la carpeta del proyecto
npm install

# crea tu archivo de configuración
cp .env.local.example .env.local
```

Abre `.env.local` con cualquier editor y pega los dos valores que copiaste de Supabase. Después:

```bash
npm run dev
```

Abre http://localhost:3000, crea una cuenta, publica una herramienta de prueba y comprueba que todo funciona.

### 3. Publícala en internet con Vercel (gratis)

1. Sube el proyecto a un repositorio de **GitHub** (github.com → New repository → sigue las instrucciones para subir esta carpeta; el archivo `.gitignore` ya evita subir cosas que no deben subirse, como tus claves).
2. Entra en https://vercel.com con tu cuenta de GitHub y pulsa **Add New → Project**.
3. Selecciona tu repositorio. Vercel detecta que es Next.js automáticamente.
4. En **Environment Variables**, añade las dos mismas variables de tu `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Pulsa **Deploy**. En un par de minutos tendrás una URL pública tipo `microtienda.vercel.app` que puedes compartir con quien quieras.

### 4. Dominio propio (opcional, ~10-15 €/año)

Compra un dominio (p. ej. en Namecheap, OVH o Porkbun) y añádelo en Vercel: **Project → Settings → Domains**. Vercel te indica exactamente qué registros DNS configurar.

## Antes de abrirla al público: lo no técnico

- **Aviso legal, términos de uso y política de privacidad**: obligatorios en España/UE (RGPD) al tener registro de usuarios.
- **Revisión de contenido**: cualquiera puede subir archivos. Al principio, revisa manualmente cada herramienta publicada antes de difundir la plataforma; distribuir ejecutables sin control es un riesgo de malware para tus usuarios. Puedes borrar herramientas desde Supabase → Table Editor → `herramientas`.
- **Límites del plan gratuito de Supabase**: 500 MB de base de datos, 1 GB de almacenamiento y 5 GB de transferencia al mes. De sobra para empezar; si creces, el plan Pro cuesta 25 $/mes.

## Cómo activar los pagos en el futuro

La base de datos ya está preparada (`gratis` y `precio` en la tabla `herramientas`). Cuando llegue el momento:

1. Crea una cuenta en **Stripe** y activa **Stripe Connect** (pensado para marketplaces: el cliente paga, Stripe reparte entre el desarrollador y tu comisión automáticamente).
2. Añade en el formulario de publicación el selector gratis/de pago (lo quitamos de la interfaz, no de la base de datos).
3. Crea una ruta de API en Next.js (`app/api/checkout/route.js`) que genere la sesión de pago de Stripe, y un webhook que registre la compra en una tabla `compras`.
4. En la ficha de herramienta, sustituye "Descargar gratis" por "Comprar" cuando `gratis = false`.

Cuando llegues a este punto, pide ayuda con "quiero añadir pagos con Stripe Connect a microtienda" y se puede construir sobre lo que ya tienes.

## Estructura del proyecto

```
app/
  page.js                  → Explorar (portada)
  herramienta/[id]/page.js → Ficha de herramienta
  publicar/page.js         → Publicar herramienta
  biblioteca/page.js       → Mi biblioteca
  cuenta/page.js           → Entrar / registro
  layout.js, globals.css   → Estructura y estilos
components/                → Cabecera y tarjeta de herramienta
lib/supabase.js            → Conexión a Supabase y constantes
supabase/schema.sql        → Esquema completo de la base de datos
```
