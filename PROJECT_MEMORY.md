# Project Memory — Yoga Write Code

## 1. Project Context
- **Project name:** Yoga Write Code (YWC)
- **Current stage:** MVP development — core 5-step workflow
- **Current objective:** Get Steps 3-5 (Cluster, Brief, Outline) working end-to-end
- **Important constraints:**
  - Vercel free tier
  - Supabase free tier
  - TypeScript strict mode (no `any`)
  - AWS Bedrock costs money per call

## 2. Key Decisions

| Date | Decision | Reason | Impact |
|---|---|---|---|
| 2026-09-19 | Disable RLS on all tables | Server actions were blocked from writing | Faster dev, must re-enable before launch |
| 2026-09-19 | Use raw HTML `<form>` instead of custom GenerateButton | Custom component wasn't passing formData | Fixed silent form submission failures |
| 2026-09-19 | Create bulletproof JSON parser (`extractJsonFromText`) | AI returns markdown + chatty text, `JSON.parse` fails | All AI parsing now robust |
| 2026-09-19 | Add `opportunity_id` column to topic_clusters, seo_briefs, article_outlines | Column was missing, causing "column not found" errors | Schema now matches code |
| 2026-09-25 | Adopt 6-file system for AI coding | Needed consistent context for AI assistants | Better AI collaboration |
| 2026-09-26 | One generated `app/opengraph-image.tsx` (1200x630) as the site-wide OG/Twitter image, with site name/canonical origin centralized in `lib/site.ts` (reads `NEXT_PUBLIC_SITE_URL`) | Homepage used a 108x108 icon as its only OG image, so shared links had no real preview; site URL was hardcoded in 6 places | Every route inherits a `summary_large_image` card; one place to change the origin |
| 2026-09-26 | Renamed `app/robot.ts` to `app/robots.ts` | File convention is `robots.ts` — the old name matched no route, so `/robots.txt` served the 404 page | Crawlers now get a valid robots.txt with the sitemap link |

## 3. Failed Approaches

| Approach | Why it failed | Lesson |
|---|---|---|
| Custom `GenerateButton` component for form submission | Silently failed to pass `opportunityId` to server action | Use raw HTML `<form>` — it's guaranteed to work |
| `revalidatePath()` + `redirect()` together | Caused NEXT_REDIRECT loop error | Pick one: either revalidate OR redirect |
| Naive `JSON.parse(result)` on AI response | AI adds markdown, conversational text, trailing commas | Always use bulletproof parser |
| Root-level `frontend/` and `backend/` folders | Breaks Next.js routing (requires `app/` folder) | Use feature-based structure inside `app/` |

## 4. Current State
- **Last completed task:** Task 5 (Content Opportunities) — working end-to-end
- **Current task:** Task 6 (Topic Clusters) — needs verification in production
- **Next recommended action:** Deploy bulletproof parser + NOT NULL fallbacks, test cluster generation
- **Known blockers:** None — all technical blockers resolved, just need to verify

## 5. Important Context
- **Vercel project:** yoga-write-code
- **Supabase project:** vxlotiguntktnxlxvkdo
- **Domain:** app.yogawritecode.com
- **GitHub:** github.com/Yoga-Write-Code/yoga-write-code