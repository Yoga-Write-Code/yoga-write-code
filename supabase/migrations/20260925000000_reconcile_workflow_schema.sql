-- Reconcile the workflow tables with the application actions.
-- These are additive changes so existing Supabase projects can be upgraded
-- without dropping user data.

alter table public.content_opportunities
  add column if not exists analysis_id uuid references public.website_analyses (id) on delete cascade;

-- Older databases required this field, while the current workflow does not
-- use it. Keep it available for existing data and give it a safe default.
alter table public.content_opportunities
  add column if not exists business_relevance text;
alter table public.content_opportunities
  alter column business_relevance set default 'medium';

alter table public.topic_clusters
  add column if not exists opportunity_id uuid references public.content_opportunities (id) on delete cascade;

alter table public.seo_briefs
  add column if not exists opportunity_id uuid references public.content_opportunities (id) on delete cascade;

alter table public.article_outlines
  add column if not exists opportunity_id uuid references public.content_opportunities (id) on delete cascade;

create index if not exists content_opportunities_analysis_id_idx
  on public.content_opportunities (analysis_id);
create index if not exists topic_clusters_opportunity_id_idx
  on public.topic_clusters (opportunity_id);
create index if not exists seo_briefs_opportunity_id_idx
  on public.seo_briefs (opportunity_id);
create index if not exists article_outlines_opportunity_id_idx
  on public.article_outlines (opportunity_id);

-- The editor and overview query article_drafts, but it was missing from the
-- original checked-in migration.
create table if not exists public.article_drafts (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  title text not null,
  content text not null default '',
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.article_drafts enable row level security;

create index if not exists article_drafts_project_id_idx
  on public.article_drafts (project_id);

drop trigger if exists article_drafts_updated_at on public.article_drafts;
create trigger article_drafts_updated_at
  before update on public.article_drafts
  for each row execute function public.set_updated_at();

drop policy if exists article_drafts_select on public.article_drafts;
create policy article_drafts_select on public.article_drafts
  for select using (public.is_owner_of_project(project_id));
drop policy if exists article_drafts_insert on public.article_drafts;
create policy article_drafts_insert on public.article_drafts
  for insert with check (public.is_owner_of_project(project_id));
drop policy if exists article_drafts_update on public.article_drafts;
create policy article_drafts_update on public.article_drafts
  for update using (public.is_owner_of_project(project_id));
drop policy if exists article_drafts_delete on public.article_drafts;
create policy article_drafts_delete on public.article_drafts
  for delete using (public.is_owner_of_project(project_id));
