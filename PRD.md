# Product Requirements Document — Yoga Write Code (YWC)

## 1. Product Overview
- **Product name:** Yoga Write Code (YWC)
- **One-line description:** AI-powered SEO content strategist that analyzes any website and generates a complete content pipeline — from opportunities to publishable outlines.
- **Problem being solved:** Content creators, bloggers, and small agencies waste hours researching topics, planning clusters, and writing briefs. Most SEO tools give data but not actionable structure.
- **Why this problem matters:** Quality content requires strategy. Without a clear pipeline (analysis → opportunities → clusters → briefs → outlines), creators produce scattered content that doesn't rank.

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