-- tasks: link each row to auth.users and enforce per-user access via RLS

alter table public.tasks
  add column if not exists user_id uuid references auth.users (id) on delete cascade;

-- Assign existing tasks to the original owner.
update public.tasks
set user_id = '4cb59e13-ba68-4ee9-9133-c1cf9cf2f226'
where user_id is null;

alter table public.tasks
  alter column user_id set not null;

create index if not exists tasks_user_id_idx on public.tasks (user_id);

alter table public.tasks enable row level security;

create policy "Users can read own tasks"
  on public.tasks
  for select
  using (auth.uid() = user_id);

create policy "Users can insert own tasks"
  on public.tasks
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update own tasks"
  on public.tasks
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
