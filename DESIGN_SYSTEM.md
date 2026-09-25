
---

### 📄 4. DESIGN_SYSTEM.md

```markdown
# Design System — Yoga Write Code

## 1. Design Direction
- **Product personality:** Professional, calm, focused (yoga-inspired clarity)
- **Visual style:** Minimal, editorial, content-first. Think Linear meets Notion.
- **Design references:** Linear.app, Vercel dashboard, Notion

## 2. Color Palette

| Token | Value | Usage |
|---|---|---|
| `--brand` | `#4F46E5` (indigo-600) | Primary actions, active states |
| `--brand-hover` | `#4338CA` (indigo-700) | Hover on primary |
| `--ink` | `#111827` (gray-900) | Primary text, headings |
| `--ink-secondary` | `#4B5563` (gray-600) | Body text, descriptions |
| `--ink-muted` | `#9CA3AF` (gray-400) | Labels, metadata, placeholders |
| `--surface` | `#FFFFFF` | Page background |
| `--surface-subtle` | `#F9FAFB` (gray-50) | Cards, sections |
| `--line` | `#E5E7EB` (gray-200) | Borders, dividers |
| `--error` | `#B91C1C` (red-700) | Error states |
| `--error-bg` | `#FEE2E2` (red-100) | Error backgrounds |
| `--success` | `#15803D` (green-700) | Success states |
| `--success-bg` | `#DCFCE7` (green-100) | Success backgrounds |

## 3. Typography
- **Body and UI font:** Inter for the dashboard, forms, editor, and marketing body copy; self-hosted with `next/font`
- **Marketing headings:** Satoshi for public-facing marketing headings, including the homepage, legal pages, navigation brand, and CTA
- **Heading treatment:** Use Satoshi with semibold or bold weight and tight tracking on marketing pages
- **Base font size:** 16px
- **Line height:** 1.6 for body, 1.2 for headings
- **Tracking:** Tight for headings (-0.02em), wide for labels (0.12em uppercase)

## 4. Components

### Buttons
- **Primary:** Black bg, white text, rounded-md, px-4 py-2, hover:bg-gray-800
- **Secondary (brand):** Indigo bg, white text, rounded-md
- **Ghost:** Transparent, text-ink-secondary, hover:bg-surface-subtle

### Cards
- **Border:** 1px solid `--line`
- **Radius:** 8px (rounded-lg)
- **Shadow:** None (flat design)
- **Padding:** 16px

### Progress Stepper
- **Done:** Green checkmark + green bg pill
- **Current:** Indigo bg pill
- **Pending:** Gray outline pill
- **Format:** "✓ 01 Analyze" / "○ 02 Opportunities"

### Fact Rows (for displaying analysis data)
- **Label:** Uppercase, tracking-wide, text-xs, text-ink-muted
- **Value:** text-sm, leading-6, text-ink-secondary
- **Separator:** border-b border-line between rows

## 5. UI Rules
- Reuse design tokens from Tailwind config
- Use shared components from `components/ui/` and `components/marketing/`
- Public marketing pages use the shared `SiteHeader`, `SiteFooter`, and `MarketingCta` components
- Dashboard, forms, and editor pages use Inter only; use font weight, size, and tracking for hierarchy
- Marketing headings use the shared Satoshi heading token; dashboard content must not use it
- Avoid arbitrary colors (no `#abc123` in code)
- Keep layouts responsive
- Use `PageHeader` for dashboard page titles
- Errors always show in red box, never as alerts