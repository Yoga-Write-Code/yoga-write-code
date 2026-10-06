alter table public.content_opportunities
  add column if not exists keyword_gaps jsonb not null default '[]'::jsonb;
