create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  kind text not null check (kind in ('income', 'expense')),
  color text not null default '#d06b38',
  created_at timestamptz not null default now()
);

create unique index if not exists categories_user_name_kind_key
  on public.categories(user_id, name, kind);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete restrict,
  amount numeric(12, 0) not null check (amount >= 0),
  entry_type text not null check (entry_type in ('income', 'expense')),
  occurred_on date not null,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists transactions_user_occurred_on_idx
  on public.transactions(user_id, occurred_on desc);

create table if not exists public.monthly_budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete cascade,
  month_start date not null,
  amount numeric(12, 0) not null check (amount >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, category_id, month_start)
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.set_owner_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'auth required';
  end if;
  new.user_id := auth.uid();
  new.updated_at := now();
  return new;
end;
$$;

create or replace function public.set_category_owner()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'auth required';
  end if;
  new.user_id := auth.uid();
  return new;
end;
$$;

drop trigger if exists set_categories_owner on public.categories;
create trigger set_categories_owner
before insert on public.categories
for each row execute procedure public.set_category_owner();

drop trigger if exists set_transactions_owner on public.transactions;
create trigger set_transactions_owner
before insert or update on public.transactions
for each row execute procedure public.set_owner_fields();

drop trigger if exists set_budgets_owner on public.monthly_budgets;
create trigger set_budgets_owner
before insert or update on public.monthly_budgets
for each row execute procedure public.set_owner_fields();

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.transactions enable row level security;
alter table public.monthly_budgets enable row level security;

create policy "profiles_select_own"
on public.profiles for select
using (auth.uid() = id);

create policy "categories_manage_own"
on public.categories for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "transactions_manage_own"
on public.transactions for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "budgets_manage_own"
on public.monthly_budgets for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
