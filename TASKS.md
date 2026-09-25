# Tasks and Progress — Yoga Write Code

## Task Rules
- Work on one primary task at a time
- Read PRD.md and ARCHITECTURE.md before coding
- Define acceptance criteria before implementation
- Update task status after completing work
- Do not mark a task complete without verifying in production
- Run `npm run build` before every push

## Statuses
- `[ ]` Not started
- `[~]` In progress
- `[x]` Completed
- `[!]` Blocked

## Phase 1: Foundation ✅
### Task 1: Project Setup
- Status: [x]
- Description: Next.js + Supabase + Vercel + AWS Bedrock setup

### Task 2: Database Schema
- Status: [x]
- Description: Create all 8 tables in Supabase

### Task 3: Authentication
- Status: [x]
- Description: Supabase Auth with login/signup

## Phase 2: Core 5-Step Workflow 🎯
### Task 4: Website Analysis (Step 1)
- Status: [x]
- Description: AI analyzes URL, saves to website_analyses

### Task 5: Content Opportunities (Step 2)
- Status: [x]
- Description: Generate 3-5 opportunities from analysis

### Task 6: Topic Clusters (Step 3) ⚠️
- Status: [~]
- Description: Generate pillar + supporting topics from opportunity
- Dependencies: Task 5
- Acceptance criteria:
  - [ ] Button passes opportunityId correctly
  - [ ] AI returns valid JSON (bulletproof parser)
  - [ ] Cluster saves to DB (opportunity_id column exists)
  - [ ] NOT NULL constraints satisfied with fallbacks
  - [ ] Page shows cluster after refresh

### Task 7: SEO Briefs (Step 4)
- Status: [ ]
- Description: Generate keyword, headings, questions
- Dependencies: Task 6

### Task 8: Article Outlines (Step 5)
- Status: [ ]
- Description: Generate H1 + structured sections
- Dependencies: Task 7

## Phase 3: Editor & Drafts
### Task 9: Article Editor
- Status: [ ]
- Description: Rich text editor for drafting articles

## Phase 4: Quality
### Task 10: Re-enable RLS
- Status: [ ]
- Description: Add row-level security policies to all tables

## Blocked Tasks
| Task | Blocker | Next Action |
|---|---|---|
| Task 6 (Clusters) | NOT NULL constraints + JSON parsing | Verify bulletproof parser works in production |