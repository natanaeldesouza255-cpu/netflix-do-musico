create table if not exists public.ndm_privacy_requests (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
 request_type text not null check(request_type in ('access','correction','deletion','portability','consent')),
 description text not null default '' check(length(description)<=2000),
 status text not null default 'pending' check(status in ('pending','reviewing','resolved','rejected')),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 constraint privacy_request_description_safe check(description !~ '[[:cntrl:]]')
);
alter table public.ndm_privacy_requests enable row level security;
revoke all on public.ndm_privacy_requests from anon;
grant select,insert on public.ndm_privacy_requests to authenticated;
revoke update,delete on public.ndm_privacy_requests from authenticated;
drop policy if exists ndm_privacy_select_own on public.ndm_privacy_requests;
create policy ndm_privacy_select_own on public.ndm_privacy_requests for select to authenticated using(user_id=auth.uid());
drop policy if exists ndm_privacy_insert_own on public.ndm_privacy_requests;
create policy ndm_privacy_insert_own on public.ndm_privacy_requests for insert to authenticated with check(user_id=auth.uid() and status='pending');
create index if not exists ndm_privacy_requests_user_time on public.ndm_privacy_requests(user_id,created_at desc);
create table if not exists public.ndm_support_tickets (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
 subject text not null check(length(subject) between 3 and 140),
 message text not null check(length(message) between 10 and 3000),
 status text not null default 'open' check(status in ('open','in_progress','closed')),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
alter table public.ndm_support_tickets enable row level security;
revoke all on public.ndm_support_tickets from anon;
grant select,insert on public.ndm_support_tickets to authenticated;
revoke update,delete on public.ndm_support_tickets from authenticated;
drop policy if exists ndm_support_select_own on public.ndm_support_tickets;
create policy ndm_support_select_own on public.ndm_support_tickets for select to authenticated using(user_id=auth.uid());
drop policy if exists ndm_support_insert_own on public.ndm_support_tickets;
create policy ndm_support_insert_own on public.ndm_support_tickets for insert to authenticated with check(user_id=auth.uid() and status='open');
create index if not exists ndm_support_tickets_user_time on public.ndm_support_tickets(user_id,created_at desc);
