# Product Requirements Document — Yoga Write Code (YWC)

## 1. Product Overview
- **Product name:** Yoga Write Code (YWC)
- **One-line description:** AI-powered SEO content strategist that analyzes any website and generates a complete content pipeline — from opportunities to publishable outlines.
- **Problem being solved:** Content creators, bloggers, and small agencies waste hours researching topics, planning clusters, and writing briefs. Most SEO tools give data but not actionable structure.
- **Why this problem matters:** Quality content requires strategy. Without a clear pipeline (analysis → opportunities → clusters → briefs → outlines), creators produce scattered content that doesn't rank.I need to build a "Comparison" (Alternative To) section for my Next.js 16.3.1 App Router marketing site to capture high-intent SEO traffic.

Before starting, read PRD.md, ARCHITECTURE.md, and CODING_RULES.md.

Please execute the following tasks automatically:

1. Folder Structure:
- Create a new folder inside the marketing route group: `app/(marketing)/compare/`.

2. Create a Reusable Comparison Table Component:
- Create `components/marketing/comparison-table.tsx`.
- It should be a "use client" component.
- It must accept `competitorName` and `features` (an array of objects with `name`, `ywc` (boolean), and `competitor` (boolean)) as props.
- Design it using the Design System:
  - Clean table layout with borders (#E5E7EB).
  - Left column: Feature name.
  - Middle column: "Yoga Write Code" (with green checkmarks for true).
  - Right column: "{competitorName}" (with gray X's for false).
  - Highlight the "Yoga Write Code" column header with a light violet background (#EDE9FE) and text (#7C3AED).

3. Create the Main Comparison Hub Page:
- Create `app/(marketing)/compare/page.tsx`.
- Add dynamic SEO metadata (Title: "Yoga Write Code vs The Competition | Best AI SEO Tool").
- Include an H1: "The Smarter Alternative to Legacy SEO Tools".
- Briefly explain why YWC is better (Full 5-step pipeline vs just text generation).
- Add 3 large cards linking to the specific competitor pages below.

4. Create Specific Competitor Pages:
Create the following pages, each using the `ComparisonTable` component:
- `app/(marketing)/compare/surfer-seo/page.tsx` (Focus: YWC is cheaper, easier, and includes AI generation, whereas Surfer is just an analyzer).
- `app/(marketing)/compare/frase/page.tsx` (Focus: YWC has better topic clustering and live SERP analysis).
- `app/(marketing)/compare/jasper/page.tsx` (Focus: YWC provides the strategy and briefs, Jasper just writes blindly).
- Each page must have its own SEO metadata (e.g., Title: "Best SurferSEO Alternative 2026 | Yoga Write Code").

5. Update the Mega Menu:
- Open `components/marketing/header.tsx`.
- Add a "Compare" link in the desktop navigation that links to `/compare`.

6. Verification (Crucial):
- Run `npm run build`.
- If there are any TypeScript errors (strict null checks, missing props), read the logs, fix the code automatically, and run the build again.
- Once successful, run:
  `git add .`
  `git commit -m "feat: Add Comparison pages (SurferSEO, Frase, Jasper alternatives)"`
  `git push origin main`

Do not ask for permission. Just read the context, write the code, fix any errors, and push to GitHub.

## 2. Target Users
- **Primary user:** Independent bloggers, content marketers, and small SaaS founders who want to grow organic traffic.
- **User context:** Technical enough to deploy a website, but not SEO experts. They want AI to do the strategic thinking.
- **Current alternatives:** Manual Google research, Ahrefs/SEMrush (expensive, overwhelming), ChatGPT prompts (unstructured).
- **Main pain points:**
  - Don't know what to write about
  - Can't organize topics into clusters
  - Briefs and outlines feel generic
  - No clear workflow from idea → draft

## 3. Product Goals
1. **Goal 1:** Turn any website URL into a complete, actionable content strategy in under 2 minutes.
2. **Goal 2:** Provide a guided 5-step workflow that removes decision fatigue.
3. **Goal 3:** Generate structured, exportable outputs (clusters, briefs, outlines) ready for the Editor.

## 4. Core Features
| Feature | Description | Priority |
|---|---|---|
| Website Analysis | AI analyzes a URL and returns company summary, category, audience, positioning | Must-have |
| Content Opportunities | Generate 3-5 specific content topics with scores, intent, funnel stage | Must-have |
| Topic Clusters | Build pillar + supporting topics from any opportunity | Must-have |
| SEO Briefs | Keyword, headings, questions, entities for a topic | Must-have |
| Article Outlines | H1 + structured sections with points | Must-have |
| Drafts & Editor | Write and edit articles with AI assistance | Must-have |

## 5. User Flow
1. User signs up and creates a **Project** (name + website URL).
2. User clicks **"Analyze Website"** → AI returns Step 1 (Analysis).
3. User sees **Step 2 (Opportunities)** → clicks "Build Cluster" on any opportunity.
4. User sees **Step 3 (Cluster)** → clicks "Generate SEO Brief".
5. User sees **Step 4 (Brief)** → clicks "Generate Outline".
6. User sees **Step 5 (Outline)** → opens Editor to draft the article.

## 6. Scope
### In scope (MVP)
- Single-user projects
- 5-step AI workflow
- Supabase database for persistence
- AWS Bedrock for AI
- Vercel deployment

### Out of scope (for now)
- Multi-user teams
- Real analytics integrations (Google Search Console)
- Payment/billing

## 7. Success Metrics
- **Metric:** % of users who complete all 5 steps for at least one project
- **Measurement method:** Database query on completed outlines
- **Target:** 40% within first month

## 8. Requirements
### Functional
- Each step depends on the previous step's output
- Users can regenerate any step
- All AI outputs are saved to Supabase
- Errors show clear messages to the user

### Non-functional
- **Security:** Row Level Security on Supabase, no secrets in client code
- **Performance:** AI calls under 30s, page loads under 2s
- **Accessibility:** Keyboard navigation, semantic HTML, ARIA labels