create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.study_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  article_id text not null,
  article_source text not null default 'posts',
  article_title text not null default '',
  article_url text not null default '',
  progress_percent integer not null default 0 check (progress_percent >= 0 and progress_percent <= 100),
  status text not null default 'not_started' check (status in ('not_started', 'reading', 'completed')),
  last_read_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, article_source, article_id)
);

drop trigger if exists set_study_progress_updated_at on public.study_progress;
create trigger set_study_progress_updated_at
before update on public.study_progress
for each row execute function public.set_updated_at();

create table if not exists public.study_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  article_id text not null,
  article_source text not null default 'posts',
  article_title text not null default '',
  previous_percent integer not null default 0 check (previous_percent >= 0 and previous_percent <= 100),
  current_percent integer not null default 0 check (current_percent >= 0 and current_percent <= 100),
  event_date date not null default current_date,
  created_at timestamptz not null default now()
);

create table if not exists public.study_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  topic text not null default '',
  target_date date,
  status text not null default 'active' check (status in ('active', 'paused', 'completed', 'archived')),
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_study_goals_updated_at on public.study_goals;
create trigger set_study_goals_updated_at
before update on public.study_goals
for each row execute function public.set_updated_at();

create table if not exists public.study_goal_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  goal_id uuid not null references public.study_goals(id) on delete cascade,
  article_id text not null,
  article_source text not null default 'posts',
  article_title text not null default '',
  article_url text not null default '',
  target_percent integer not null default 100 check (target_percent >= 0 and target_percent <= 100),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (goal_id, article_source, article_id)
);

create table if not exists public.article_chunks (
  id uuid primary key default gen_random_uuid(),
  article_id text not null,
  article_source text not null default 'posts',
  article_title text not null default '',
  chunk_index integer not null default 0,
  content text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (article_source, article_id, chunk_index)
);

alter table public.study_progress enable row level security;
alter table public.study_events enable row level security;
alter table public.study_goals enable row level security;
alter table public.study_goal_items enable row level security;
alter table public.article_chunks enable row level security;

drop policy if exists "study_progress_select_own" on public.study_progress;
create policy "study_progress_select_own" on public.study_progress
for select to authenticated using (auth.uid() = user_id);

drop policy if exists "study_progress_insert_own" on public.study_progress;
create policy "study_progress_insert_own" on public.study_progress
for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "study_progress_update_own" on public.study_progress;
create policy "study_progress_update_own" on public.study_progress
for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "study_progress_delete_own" on public.study_progress;
create policy "study_progress_delete_own" on public.study_progress
for delete to authenticated using (auth.uid() = user_id);

drop policy if exists "study_events_select_own" on public.study_events;
create policy "study_events_select_own" on public.study_events
for select to authenticated using (auth.uid() = user_id);

drop policy if exists "study_events_insert_own" on public.study_events;
create policy "study_events_insert_own" on public.study_events
for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "study_events_delete_own" on public.study_events;
create policy "study_events_delete_own" on public.study_events
for delete to authenticated using (auth.uid() = user_id);

drop policy if exists "study_goals_select_own" on public.study_goals;
create policy "study_goals_select_own" on public.study_goals
for select to authenticated using (auth.uid() = user_id);

drop policy if exists "study_goals_insert_own" on public.study_goals;
create policy "study_goals_insert_own" on public.study_goals
for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "study_goals_update_own" on public.study_goals;
create policy "study_goals_update_own" on public.study_goals
for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "study_goals_delete_own" on public.study_goals;
create policy "study_goals_delete_own" on public.study_goals
for delete to authenticated using (auth.uid() = user_id);

drop policy if exists "study_goal_items_select_own" on public.study_goal_items;
create policy "study_goal_items_select_own" on public.study_goal_items
for select to authenticated using (auth.uid() = user_id);

drop policy if exists "study_goal_items_insert_own" on public.study_goal_items;
create policy "study_goal_items_insert_own" on public.study_goal_items
for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "study_goal_items_update_own" on public.study_goal_items;
create policy "study_goal_items_update_own" on public.study_goal_items
for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "study_goal_items_delete_own" on public.study_goal_items;
create policy "study_goal_items_delete_own" on public.study_goal_items
for delete to authenticated using (auth.uid() = user_id);

drop policy if exists "article_chunks_select_authenticated" on public.article_chunks;
create policy "article_chunks_select_authenticated" on public.article_chunks
for select to authenticated using (true);
