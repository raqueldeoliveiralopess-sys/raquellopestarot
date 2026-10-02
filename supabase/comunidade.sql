-- Grimório Arcano — Comunidade (mural com temas, comentários, curtidas e fotos)
-- Rode DEPOIS do schema.sql. Cole tudo no SQL Editor do Supabase e clique em Run.
-- Pode rodar mais de uma vez sem problema.

-- 1) Quem administra (apaga posts/comentários, fixa avisos, bloqueia). Sem políticas: só o painel grava.
create table if not exists public.admins (
  email text primary key
);
alter table public.admins enable row level security;

-- 2) Alunas bloqueadas de postar e comentar
create table if not exists public.bloqueadas (
  user_id uuid primary key references auth.users(id) on delete cascade,
  em      timestamptz not null default now()
);
alter table public.bloqueadas enable row level security;

-- 3) Funções de apoio (rodam com permissão do banco, só leem o necessário)
create or replace function public.e_assinante() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.assinantes
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      and status in ('ativa', 'atrasada')
  );
$$;

create or replace function public.e_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.admins
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

create or replace function public.e_bloqueada() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.bloqueadas where user_id = auth.uid());
$$;

revoke all on function public.e_assinante() from public;
revoke all on function public.e_admin() from public;
revoke all on function public.e_bloqueada() from public;
grant execute on function public.e_assinante() to authenticated;
grant execute on function public.e_admin() to authenticated;
grant execute on function public.e_bloqueada() to authenticated;

drop policy if exists "admin: ver bloqueadas" on public.bloqueadas;
drop policy if exists "admin: bloquear" on public.bloqueadas;
drop policy if exists "admin: desbloquear" on public.bloqueadas;
create policy "admin: ver bloqueadas" on public.bloqueadas for select to authenticated using (public.e_admin());
create policy "admin: bloquear"       on public.bloqueadas for insert to authenticated with check (public.e_admin());
create policy "admin: desbloquear"    on public.bloqueadas for delete to authenticated using (public.e_admin());

-- 4) Todo usuário novo ganha uma linha em perfis (os posts apontam para perfis)
create or replace function public.criar_perfil() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.perfis (id) values (new.id) on conflict (id) do nothing;
  return new;
end;
$$;
drop trigger if exists ao_criar_usuario on auth.users;
create trigger ao_criar_usuario after insert on auth.users
  for each row execute function public.criar_perfil();
insert into public.perfis (id) select id from auth.users on conflict (id) do nothing;

-- Assinantes veem nome e foto umas das outras (para aparecer nos posts)
drop policy if exists "perfis: assinantes se veem" on public.perfis;
create policy "perfis: assinantes se veem" on public.perfis for select to authenticated
  using (public.e_assinante() or public.e_admin());

-- 5) Posts
create table if not exists public.posts (
  id        bigint generated always as identity primary key,
  autor     uuid not null default auth.uid() references public.perfis(id) on delete cascade,
  tema      text not null check (tema in ('estudo', 'tiragem', 'duvida', 'reflexao', 'achadinho')),
  texto     text not null check (char_length(texto) between 1 and 2000),
  foto_url  text,
  fixado    boolean not null default false,
  criado_em timestamptz not null default now()
);
create index if not exists posts_ordem on public.posts (fixado desc, criado_em desc);
create index if not exists posts_tema on public.posts (tema);
alter table public.posts enable row level security;

drop policy if exists "posts: assinantes leem" on public.posts;
drop policy if exists "posts: assinantes publicam" on public.posts;
drop policy if exists "posts: admin fixa" on public.posts;
drop policy if exists "posts: autora ou admin apaga" on public.posts;
create policy "posts: assinantes leem" on public.posts for select to authenticated
  using (public.e_assinante() or public.e_admin());
create policy "posts: assinantes publicam" on public.posts for insert to authenticated
  with check (
    autor = auth.uid()
    and (public.e_assinante() or public.e_admin())
    and not public.e_bloqueada()
    and (fixado = false or public.e_admin())
  );
create policy "posts: admin fixa" on public.posts for update to authenticated
  using (public.e_admin()) with check (public.e_admin());
create policy "posts: autora ou admin apaga" on public.posts for delete to authenticated
  using (autor = auth.uid() or public.e_admin());

-- 6) Comentários
create table if not exists public.comentarios (
  id        bigint generated always as identity primary key,
  post_id   bigint not null references public.posts(id) on delete cascade,
  autor     uuid not null default auth.uid() references public.perfis(id) on delete cascade,
  texto     text not null check (char_length(texto) between 1 and 1000),
  criado_em timestamptz not null default now()
);
create index if not exists comentarios_post on public.comentarios (post_id, criado_em);
alter table public.comentarios enable row level security;

drop policy if exists "comentarios: assinantes leem" on public.comentarios;
drop policy if exists "comentarios: assinantes comentam" on public.comentarios;
drop policy if exists "comentarios: autora ou admin apaga" on public.comentarios;
create policy "comentarios: assinantes leem" on public.comentarios for select to authenticated
  using (public.e_assinante() or public.e_admin());
create policy "comentarios: assinantes comentam" on public.comentarios for insert to authenticated
  with check (autor = auth.uid() and (public.e_assinante() or public.e_admin()) and not public.e_bloqueada());
create policy "comentarios: autora ou admin apaga" on public.comentarios for delete to authenticated
  using (autor = auth.uid() or public.e_admin());

-- 7) Curtidas
create table if not exists public.curtidas (
  post_id bigint not null references public.posts(id) on delete cascade,
  user_id uuid not null default auth.uid() references public.perfis(id) on delete cascade,
  primary key (post_id, user_id)
);
alter table public.curtidas enable row level security;

drop policy if exists "curtidas: assinantes leem" on public.curtidas;
drop policy if exists "curtidas: curtir" on public.curtidas;
drop policy if exists "curtidas: descurtir" on public.curtidas;
create policy "curtidas: assinantes leem" on public.curtidas for select to authenticated
  using (public.e_assinante() or public.e_admin());
create policy "curtidas: curtir" on public.curtidas for insert to authenticated
  with check (user_id = auth.uid() and (public.e_assinante() or public.e_admin()));
create policy "curtidas: descurtir" on public.curtidas for delete to authenticated
  using (user_id = auth.uid());

-- 8) Fotos dos posts: pasta pública com nomes aleatórios; cada aluna grava na própria pasta
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('comunidade', 'comunidade', true, 2097152, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = true, file_size_limit = 2097152, allowed_mime_types = array['image/jpeg','image/png','image/webp'];

drop policy if exists "comunidade: enviar foto" on storage.objects;
drop policy if exists "comunidade: ver a propria" on storage.objects;
drop policy if exists "comunidade: apagar foto" on storage.objects;
create policy "comunidade: enviar foto" on storage.objects for insert to authenticated
  with check (
    bucket_id = 'comunidade'
    and (storage.foldername(name))[1] = auth.uid()::text
    and (public.e_assinante() or public.e_admin())
    and not public.e_bloqueada()
  );
create policy "comunidade: ver a propria" on storage.objects for select to authenticated
  using (bucket_id = 'comunidade' and ((storage.foldername(name))[1] = auth.uid()::text or public.e_admin()));
create policy "comunidade: apagar foto" on storage.objects for delete to authenticated
  using (bucket_id = 'comunidade' and ((storage.foldername(name))[1] = auth.uid()::text or public.e_admin()));

-- 9) Torne-se administradora (troque pelo seu e-mail e rode só esta linha):
-- insert into public.admins (email) values ('seu-email@exemplo.com') on conflict do nothing;

-- Para desbloquear uma aluna, apague a linha dela em bloqueadas pelo Table Editor.
