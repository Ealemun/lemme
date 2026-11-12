-- Lemme — base de données de synchronisation.
-- À exécuter une fois dans l'éditeur SQL du projet Supabase.
--
-- Une seule table : une ligne par personne, contenant toute sa progression
-- (état de révision de chaque question, journal quotidien, leçons et exercices
-- terminés, réglages). La fusion entre appareils est faite par l'application.

create table if not exists public.progress (
  user_id    uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  data       jsonb not null,
  updated_at timestamptz not null default now()
);

-- Sécurité au niveau des lignes : sans les règles ci-dessous, personne ne lit ni n'écrit rien.
alter table public.progress enable row level security;

-- Chaque personne connectée ne voit et ne modifie que sa propre ligne.
create policy "lire sa progression" on public.progress
  for select to authenticated using ((select auth.uid()) = user_id);

create policy "creer sa progression" on public.progress
  for insert to authenticated with check ((select auth.uid()) = user_id);

create policy "modifier sa progression" on public.progress
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy "supprimer sa progression" on public.progress
  for delete to authenticated using ((select auth.uid()) = user_id);
