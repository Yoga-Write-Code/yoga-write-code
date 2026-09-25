-- Repair workflow RLS policies on databases that were initialized or modified
-- outside the original migration. The server action uses the signed-in user,
-- so every workflow row must be scoped to that user's project.

do $$
declare
  policy_record record;
begin
  for policy_record in
    select policyname, tablename
    from pg_policies
    where schemaname = 'public'
      and tablename in (
        'website_analyses',
        'content_opportunities',
        'topic_clusters',
        'seo_briefs',
        'article_outlines',
        'article_drafts'
      )
  loop
    execute format(
      'drop policy if exists %I on public.%I',
      policy_record.policyname,
      policy_record.tablename
    );
  end loop;
end;
$$;

alter table public.website_analyses enable row level security;
alter table public.content_opportunities enable row level security;
alter table public.topic_clusters enable row level security;
alter table public.seo_briefs enable row level security;
alter table public.article_outlines enable row level security;
alter table public.article_drafts enable row level security;

create policy website_analyses_select_owned
  on public.website_analyses for select
  using (exists (
    select 1 from public.projects p
    where p.id = project_id and p.user_id = auth.uid()
  ));

create policy website_analyses_insert_owned
  on public.website_analyses for insert
  with check (exists (
    select 1 from public.projects p
    where p.id = project_id and p.user_id = auth.uid()
  ));

create policy website_analyses_update_owned
  on public.website_analyses for update
  using (exists (
    select 1 from public.projects p
    where p.id = project_id and p.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.projects p
    where p.id = project_id and p.user_id = auth.uid()
  ));

create policy website_analyses_delete_owned
  on public.website_analyses for delete
  using (exists (
    select 1 from public.projects p
    where p.id = project_id and p.user_id = auth.uid()
  ));

create policy content_opportunities_select_owned
  on public.content_opportunities for select
  using (exists (
    select 1 from public.projects p
    where p.id = project_id and p.user_id = auth.uid()
  ));

create policy content_opportunities_insert_owned
  on public.content_opportunities for insert
  with check (exists (
    select 1 from public.projects p
    where p.id = project_id and p.user_id = auth.uid()
  ));

create policy content_opportunities_update_owned
  on public.content_opportunities for update
  using (exists (
    select 1 from public.projects p
    where p.id = project_id and p.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.projects p
    where p.id = project_id and p.user_id = auth.uid()
  ));

create policy content_opportunities_delete_owned
  on public.content_opportunities for delete
  using (exists (
    select 1 from public.projects p
    where p.id = project_id and p.user_id = auth.uid()
  ));

create policy topic_clusters_select_owned
  on public.topic_clusters for select
  using (exists (
    select 1 from public.projects p
    where p.id = project_id and p.user_id = auth.uid()
  ));

create policy topic_clusters_insert_owned
  on public.topic_clusters for insert
  with check (exists (
    select 1 from public.projects p
    where p.id = project_id and p.user_id = auth.uid()
  ));

create policy topic_clusters_update_owned
  on public.topic_clusters for update
  using (exists (
    select 1 from public.projects p
    where p.id = project_id and p.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.projects p
    where p.id = project_id and p.user_id = auth.uid()
  ));

create policy topic_clusters_delete_owned
  on public.topic_clusters for delete
  using (exists (
    select 1 from public.projects p
    where p.id = project_id and p.user_id = auth.uid()
  ));

create policy seo_briefs_select_owned
  on public.seo_briefs for select
  using (exists (
    select 1 from public.projects p
    where p.id = project_id and p.user_id = auth.uid()
  ));

create policy seo_briefs_insert_owned
  on public.seo_briefs for insert
  with check (exists (
    select 1 from public.projects p
    where p.id = project_id and p.user_id = auth.uid()
  ));

create policy seo_briefs_update_owned
  on public.seo_briefs for update
  using (exists (
    select 1 from public.projects p
    where p.id = project_id and p.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.projects p
    where p.id = project_id and p.user_id = auth.uid()
  ));

create policy seo_briefs_delete_owned
  on public.seo_briefs for delete
  using (exists (
    select 1 from public.projects p
    where p.id = project_id and p.user_id = auth.uid()
  ));

create policy article_outlines_select_owned
  on public.article_outlines for select
  using (exists (
    select 1 from public.projects p
    where p.id = project_id and p.user_id = auth.uid()
  ));

create policy article_outlines_insert_owned
  on public.article_outlines for insert
  with check (exists (
    select 1 from public.projects p
    where p.id = project_id and p.user_id = auth.uid()
  ));

create policy article_outlines_update_owned
  on public.article_outlines for update
  using (exists (
    select 1 from public.projects p
    where p.id = project_id and p.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.projects p
    where p.id = project_id and p.user_id = auth.uid()
  ));

create policy article_outlines_delete_owned
  on public.article_outlines for delete
  using (exists (
    select 1 from public.projects p
    where p.id = project_id and p.user_id = auth.uid()
  ));

create policy article_drafts_select_owned
  on public.article_drafts for select
  using (exists (
    select 1 from public.projects p
    where p.id = project_id and p.user_id = auth.uid()
  ));

create policy article_drafts_insert_owned
  on public.article_drafts for insert
  with check (exists (
    select 1 from public.projects p
    where p.id = project_id and p.user_id = auth.uid()
  ));

create policy article_drafts_update_owned
  on public.article_drafts for update
  using (exists (
    select 1 from public.projects p
    where p.id = project_id and p.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.projects p
    where p.id = project_id and p.user_id = auth.uid()
  ));

create policy article_drafts_delete_owned
  on public.article_drafts for delete
  using (exists (
    select 1 from public.projects p
    where p.id = project_id and p.user_id = auth.uid()
  ));
