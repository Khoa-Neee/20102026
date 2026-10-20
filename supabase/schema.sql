-- Chạy toàn bộ file này một lần trong Supabase Dashboard > SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.room_state (
    id text primary key,
    notes jsonb not null default '[]'::jsonb,
    frames jsonb not null default '[]'::jsonb,
    photobook jsonb not null default '[]'::jsonb,
    updated_at timestamptz not null default now()
);

insert into public.room_state (id) values ('main') on conflict (id) do nothing;

create table if not exists public.memory_items (
    id uuid primary key default gen_random_uuid(),
    image_url text not null,
    storage_path text not null,
    caption text not null default '',
    created_at timestamptz not null default now()
);

alter table public.room_state enable row level security;
alter table public.memory_items enable row level security;

drop policy if exists "public room read" on public.room_state;
drop policy if exists "public room write" on public.room_state;
drop policy if exists "public memories read" on public.memory_items;
drop policy if exists "public memories add" on public.memory_items;
drop policy if exists "public memories update" on public.memory_items;
drop policy if exists "public memories delete" on public.memory_items;

create policy "public room read" on public.room_state for select to anon, authenticated using (true);
create policy "public room write" on public.room_state for all to anon, authenticated using (true) with check (true);
create policy "public memories read" on public.memory_items for select to anon, authenticated using (true);
create policy "public memories add" on public.memory_items for insert to anon, authenticated with check (true);
create policy "public memories update" on public.memory_items for update to anon, authenticated using (true) with check (true);
create policy "public memories delete" on public.memory_items for delete to anon, authenticated using (true);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('a1k37-media', 'a1k37-media', true, 10485760, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "public media read" on storage.objects;
drop policy if exists "public media add" on storage.objects;
drop policy if exists "public media update" on storage.objects;
drop policy if exists "public media delete" on storage.objects;

create policy "public media read" on storage.objects for select to anon, authenticated using (bucket_id = 'a1k37-media');
create policy "public media add" on storage.objects for insert to anon, authenticated with check (bucket_id = 'a1k37-media');
create policy "public media update" on storage.objects for update to anon, authenticated using (bucket_id = 'a1k37-media') with check (bucket_id = 'a1k37-media');
create policy "public media delete" on storage.objects for delete to anon, authenticated using (bucket_id = 'a1k37-media');

do $$ begin
    alter publication supabase_realtime add table public.room_state;
exception when duplicate_object then null;
end $$;

do $$ begin
    alter publication supabase_realtime add table public.memory_items;
exception when duplicate_object then null;
end $$;
