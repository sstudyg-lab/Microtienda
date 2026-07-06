-- ============================================================
-- MICROTIENDA - Esquema de base de datos para Supabase
-- Pega todo este archivo en: Supabase -> SQL Editor -> Run
-- ============================================================

-- 1. PERFILES (uno por usuario registrado)
create table public.perfiles (
  id uuid primary key references auth.users on delete cascade,
  nombre text not null,
  creado timestamptz default now()
);

alter table public.perfiles enable row level security;
create policy "los perfiles son publicos" on public.perfiles for select using (true);
create policy "cada usuario edita su perfil" on public.perfiles for update using (auth.uid() = id);

-- Crea el perfil automaticamente al registrarse un usuario
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.perfiles (id, nombre)
  values (new.id, coalesce(new.raw_user_meta_data->>'nombre', split_part(new.email, '@', 1)));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2. HERRAMIENTAS (los microprogramas publicados)
-- Nota: "gratis" y "precio" ya existen para poder activar pagos en el futuro
create table public.herramientas (
  id uuid primary key default gen_random_uuid(),
  dev_id uuid not null references public.perfiles(id) on delete cascade,
  nombre text not null,
  descripcion text not null,
  categoria text not null,
  tipo text not null,
  etiquetas text[] default '{}',
  gratis boolean not null default true,
  precio numeric not null default 0,
  archivo_url text,
  enlace_web text,
  capturas text[] default '{}',
  descargas integer not null default 0,
  version text not null default '1.0',
  creado timestamptz default now(),
  actualizado timestamptz default now()
);

alter table public.herramientas enable row level security;
create policy "cualquiera puede ver herramientas" on public.herramientas for select using (true);
create policy "usuarios registrados publican" on public.herramientas for insert with check (auth.uid() = dev_id);
create policy "cada dev edita las suyas" on public.herramientas for update using (auth.uid() = dev_id);
create policy "cada dev borra las suyas" on public.herramientas for delete using (auth.uid() = dev_id);

-- 3. DESCARGAS (la biblioteca de cada usuario)
create table public.descargas (
  usuario_id uuid references public.perfiles(id) on delete cascade,
  herramienta_id uuid references public.herramientas(id) on delete cascade,
  creado timestamptz default now(),
  primary key (usuario_id, herramienta_id)
);

alter table public.descargas enable row level security;
create policy "cada usuario ve su biblioteca" on public.descargas for select using (auth.uid() = usuario_id);
create policy "cada usuario anade a su biblioteca" on public.descargas for insert with check (auth.uid() = usuario_id);

-- 4. VALORACIONES (una por usuario y herramienta)
create table public.valoraciones (
  usuario_id uuid references public.perfiles(id) on delete cascade,
  herramienta_id uuid references public.herramientas(id) on delete cascade,
  puntuacion integer not null check (puntuacion between 1 and 5),
  comentario text,
  creado timestamptz default now(),
  primary key (usuario_id, herramienta_id)
);

alter table public.valoraciones enable row level security;
create policy "las valoraciones son publicas" on public.valoraciones for select using (true);
create policy "usuarios registrados valoran" on public.valoraciones for insert with check (auth.uid() = usuario_id);
create policy "cada usuario edita su valoracion" on public.valoraciones for update using (auth.uid() = usuario_id);

-- 5. FUNCION: registrar una descarga (anade a biblioteca + suma el contador)
create or replace function public.registrar_descarga(h uuid)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.descargas (usuario_id, herramienta_id)
  values (auth.uid(), h)
  on conflict do nothing;
  if found then
    update public.herramientas set descargas = descargas + 1 where id = h;
  end if;
end;
$$;

-- 6. ALMACENAMIENTO: buckets para programas y capturas de pantalla
insert into storage.buckets (id, name, public) values
  ('archivos', 'archivos', true),
  ('capturas', 'capturas', true);

create policy "subida para registrados" on storage.objects
  for insert to authenticated
  with check (bucket_id in ('archivos', 'capturas'));

create policy "lectura publica de archivos" on storage.objects
  for select using (bucket_id in ('archivos', 'capturas'));
