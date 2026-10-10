-- Store the 3-5 specific SERP keywords generated per content opportunity.
-- Additive only: safe for existing projects, old rows default to [].
alter table public.content_opportunities
  add column if not exists target_keywords jsonb not null default '[]'::jsonb;
