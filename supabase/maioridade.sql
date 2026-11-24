-- Coven Strix só para maiores de 18 anos (Preceitos Oficiais 2.0). Cole tudo no SQL Editor do Supabase e clique em Run. Pode rodar mais de uma vez.
-- O cadastro novo passa a recusar quem tem menos de 18. Ninguém que já está cadastrado é removido nem pausado por este bloco.

create or replace function public.cob_membros_antes() returns trigger
language plpgsql security definer set search_path = public as $$
declare idade int;
begin
  if auth.uid() is null then raise exception 'sem_sessao'; end if;
  new.user_id   := auth.uid();
  new.email     := lower(coalesce(auth.jwt() ->> 'email', new.email));
  new.nome      := btrim(regexp_replace(new.nome, '\s+', ' ', 'g'));
  new.cpf       := regexp_replace(coalesce(new.cpf, ''), '\D', '', 'g');
  new.whatsapp  := regexp_replace(coalesce(new.whatsapp, ''), '\D', '', 'g');
  if new.nome !~ '\S+\s+\S+' then raise exception 'nome_incompleto'; end if;
  if not public.cpf_valido(new.cpf) then raise exception 'cpf_invalido'; end if;
  if length(new.whatsapp) not between 10 and 13 then raise exception 'whatsapp_invalido'; end if;
  idade := extract(year from age(current_date, new.nascimento));
  if new.nascimento > current_date or idade > 110 then raise exception 'nascimento_invalido'; end if;
  -- Preceitos Oficiais 2.0 (23/11/2026): a comunidade é exclusiva para maiores de 18 anos
  if idade < 18 then raise exception 'idade_minima'; end if;
  new.resp_nome := null; new.resp_cpf := null; new.resp_telefone := null; new.resp_email := null;
  new.resp_parentesco := null; new.resp_imagem := null; new.resp_declara := null;
  if new.aceite is not true then raise exception 'sem_aceite'; end if;
  new.aceite_em := now();
  new.aceite_ip := nullif(btrim(split_part(coalesce(public.cob_cabecalho('x-forwarded-for'), ''), ',', 1)), '');
  new.aceite_ua := left(public.cob_cabecalho('user-agent'), 300);
  new.criado_em := now();
  new.ultimo_acesso := now();
  return new;
end $$;

-- Para conferir: cadastros que hoje têm menos de 18 anos (a decisão sobre eles é da administração; nada muda sozinho)
select nome, email, whatsapp, nascimento, extract(year from age(current_date, nascimento))::int as idade, acesso
  from public.cob_membros
 where nascimento > current_date - interval '18 years'
 order by nascimento desc;
