-- Custom label when user selects "Other" in priorities onboarding
alter table public.user_context
  add column if not exists other_priority text;
