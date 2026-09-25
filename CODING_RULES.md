
---

###  3. CODING_RULES.md

```markdown
# Coding Rules — Yoga Write Code

## 1. General Principles
- Prefer simple, readable code over clever code
- Make the smallest change necessary to fix a bug
- Reuse existing components and utilities before creating new ones
- **Never leave a `console.log` in production code**

## 2. TypeScript Rules (CRITICAL)
- **Strict mode is ON.** All variables must have types.
- Never use `any` without an explicit type assertion like `as Record<string, unknown>`
- Always check for `null` before accessing properties:
  ```typescript
  // ❌ BAD — causes TS18047 error
  const id = analysis.id;

  // ✅ GOOD
  if (!analysis) throw new Error("Analysis not found");
  const id = analysis.id;