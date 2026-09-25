# Project Architecture — Yoga Write Code

## 1. Technology Stack
- **Frontend:** Next.js 16.3.1 (App Router, React Server Components)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS with custom design tokens
- **Backend:** Next.js Server Actions (in `actions.ts` files)
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **AI:** AWS Bedrock (Claude models via `invokeBedrock`)
- **Deployment:** Vercel (production)

## 2. Architecture Principles
- **Server-first:** Fetch data in server components, pass to client via props
- **Thin pages:** `page.tsx` only fetches data and renders a frontend component
- **Actions are backend:** All DB writes and AI calls live in `actions.ts`
- **One source of truth:** Database is canonical; UI reflects DB state
- **Fail visibly:** Never silently swallow errors; show them to user

## 3. Project Structure
```text
yoga-write-code/
├── app/
│   ├── (auth)/              # Login, signup, auth callback
│   ├── (marketing)/         # Landing page, pricing, legal
│   └── dashboard/
│       ├── layout.tsx       # Sidebar + auth guard
│       └── projects/
│           └── [id]/
│               ├── page.tsx         # ⚠️ MUST be named page.tsx
│               ├── actions.ts       # 🔙 Backend: AI + DB writes
│               └── components/      # 🎨 Frontend: UI for this page
├── components/
│   ├── ui/                  # Shadcn-style primitives
│   └── dashboard/           # Sidebar, GenerateButton, PageHeader
├── lib/
│   ├── supabase/            # Client + server Supabase clients
│   └── ai/
│       └── bedrock.ts       # invokeBedrock() function
├── hooks/                   # React hooks
├── types/                   # TypeScript interfaces
└── public/                  # Static assets