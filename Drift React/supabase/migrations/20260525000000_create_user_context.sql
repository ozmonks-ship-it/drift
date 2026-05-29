-- user_context: onboarding answers linked to auth.users
create table if not exists public.user_context (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  priorities text[] not null default '{}',
  other_priority text,
  work_style text,
  tendencies text[] not null default '{}',
  focus_days text[] not null default '{}',
  free_text text
);

alter table public.user_context enable row level security;

create policy "Users can read own user_context"
  on public.user_context
  for select
  using (auth.uid() = user_id);

create policy "Users can insert own user_context"
  on public.user_context
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update own user_context"
  on public.user_context
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create or replace function public.set_user_context_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger user_context_updated_at
  before update on public.user_context
  for each row
  execute function public.set_user_context_updated_at();
