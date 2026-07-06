import { createClient } from "@supabase/supabase-js";

// Las claves se leen de .env.local (ver .env.local.example).
// Los valores por defecto solo evitan errores si aun no has configurado nada.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder";

export const supabase = createClient(url, key);

export const CATEGORIAS = [
  "IA", "Productividad", "Programación", "Diseño", "Automatización",
  "Marketing", "Finanzas", "Oficina", "Educación", "Multimedia", "Utilidades",
];

export const TIPOS = [
  "Script", "Herramienta web", "App de escritorio", "Extensión",
  "Bot", "API", "Plugin", "Automatización",
];
