# Phase 1 Main Pages Visual Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the approved visual rebuild for Home, Couple Space, and Interact pages with a sweet/lively pixel style while keeping all existing feature logic unchanged.

**Architecture:** Keep data flow and routing untouched in page components, and centralize visual behavior in shared CSS tokens/classes (`index.css`) so all three pages reuse the same style language. Execute page-by-page replacement with visual acceptance gates after each page to avoid cross-page regressions.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, Vite, ESLint, Vercel

**Git Note:** If the workspace is not a git repository, execute all non-commit steps and record a local checkpoint note instead of commit commands.

---

## File Structure and Responsibilities

- Modify: `src/styles/index.css`
  - Owns shared visual tokens/classes for card, hero, touch target, text clamping, and consistent interaction states.
- Modify: `src/pages/HomePage.tsx`
  - Keeps existing Supabase/localStorage logic; updates layout hierarchy and class usage to match approved visual spec.
- Modify: `src/pages/CoupleSpacePage.tsx`
  - Keeps existing navigation routes; updates card rhythm/tag/icon/text structure for consistency and readability.
- Modify: `src/pages/InteractPage.tsx`
  - Keeps existing game routes; aligns visual hierarchy with CoupleSpace and global design system.
- Create: `docs/superpowers/checklists/2026-05-09-phase1-visual-gates.md`
  - Test-first visual gate checklist for the three required pass criteria (atmosphere, readability, touch).
- Verify: `npm exec eslint -- <changed-files>` and `npm run build`

---

### Task 1: Create test-first visual gate checklist and baseline

**Files:**
- Create: `docs/superpowers/checklists/2026-05-09-phase1-visual-gates.md`
- Test: N/A (manual gate + CLI verification)

- [ ] **Step 1: Write the failing visual gate checklist**

```md
# Phase 1 Visual Gates (Fail First)

## Home
- [ ] Atmosphere gate: first-screen feels sweet/lively within 3 seconds
- [ ] Readability gate: no clipped/overflowing/overlapping text
- [ ] Touch gate: all primary actions are >= 44px and non-crowded

## Couple Space
- [ ] Atmosphere gate: matches same product language as Home
- [ ] Readability gate: title/desc/tag do not collide
- [ ] Touch gate: card hit areas remain >= 44px

## Interact
- [ ] Atmosphere gate: playful but consistent with Couple Space
- [ ] Readability gate: title/desc/tag fit without clipping
- [ ] Touch gate: grid items are easy to tap without mis-touch
```

- [ ] **Step 2: Run baseline engineering checks before UI edits**

Run:
```bash
npm exec eslint -- src/pages/HomePage.tsx src/pages/CoupleSpacePage.tsx src/pages/InteractPage.tsx
npm run build
```
Expected:
- ESLint exits 0
- Build succeeds

- [ ] **Step 3: Commit checklist baseline**

```bash
git add docs/superpowers/checklists/2026-05-09-phase1-visual-gates.md
git commit -m "docs: add phase1 visual gate checklist"
```

---

### Task 2: Standardize shared visual classes in CSS (single source of truth)

**Files:**
- Modify: `src/styles/index.css`
- Test: `npm exec eslint -- src/pages/HomePage.tsx src/pages/CoupleSpacePage.tsx src/pages/InteractPage.tsx`, `npm run build`

- [ ] **Step 1: Write failing gate note for cross-page inconsistency**

Add to checklist file before CSS edits:
```md
- [ ] Shared style gate: hero/card/tag/press-state look inconsistent across 3 pages
```

- [ ] **Step 2: Add minimal shared utility classes for readability and touch**

Add to `src/styles/index.css`:
```css
.ui-touch-target {
  min-height: 44px;
  min-width: 44px;
}

.ui-safe-text {
  min-width: 0;
  overflow: hidden;
}

.ui-clamp-1 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ui-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.ui-card-title {
  font-size: 14px;
  font-weight: 900;
  line-height: 1.2;
  color: var(--color-text-primary);
}

.ui-card-desc {
  margin-top: 4px;
  font-size: 11px;
  line-height: 1.35;
  color: var(--color-text-muted);
}
```

- [ ] **Step 3: Unify press feedback timing on interactive cards**

Ensure shared transition remains consistent:
```css
.card-pressable,
.pixel-card.card-pressable {
  transition: transform 0.15s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.card-pressable:active {
  transform: scale(0.98);
}
```

- [ ] **Step 4: Run verification after CSS change**

Run:
```bash
npm exec eslint -- src/pages/HomePage.tsx src/pages/CoupleSpacePage.tsx src/pages/InteractPage.tsx
npm run build
```
Expected:
- No type/style break from new classes
- Build succeeds

- [ ] **Step 5: Commit shared style foundation**

```bash
git add src/styles/index.css docs/superpowers/checklists/2026-05-09-phase1-visual-gates.md
git commit -m "style: add shared visual utilities for phase1 pages"
```

---

### Task 3: Rebuild Home page visual hierarchy (no logic changes)

**Files:**
- Modify: `src/pages/HomePage.tsx`
- Test: `npm exec eslint -- src/pages/HomePage.tsx` and `npm run build`

- [ ] **Step 1: Record failing Home gates before edits**

Checklist entry must remain unchecked before implementation:
```md
## Home
- [ ] Atmosphere gate
- [ ] Readability gate
- [ ] Touch gate
```

- [ ] **Step 2: Apply shared text/touch classes to critical Home blocks**

Update representative parts in `HomePage.tsx`:
```tsx
<div className={`pixel-hero shrink-0 px-6 py-3.5 text-left ${isClose ? 'ring-1 ring-warm-100/80' : ''}`}>
  <div className="pixel-photo-card photo-card-2 absolute right-4 top-1/2 -translate-y-1/2 opacity-[0.88]" />
  <div className="relative z-10 pr-24 ui-safe-text">
    <p className="text-xs font-semibold text-white/72 ui-clamp-1">距离下次见面</p>
    ...
  </div>
</div>
```

- [ ] **Step 3: Ensure long-text safety on reminder and emergency blocks**

Use clamp/safe classes:
```tsx
{warmReminder && (
  <div className="pixel-note shrink-0 px-4 py-3 backdrop-blur-md">
    <p className="text-sm font-black text-warm-600">今日小纸条</p>
    <p className="mt-1 text-sm leading-relaxed text-text-secondary ui-clamp-2">{warmReminder}</p>
  </div>
)}
```

- [ ] **Step 4: Guarantee touch targets for tab buttons**

```tsx
<button
  key={key}
  onClick={() => setTab(key)}
  className={`ui-touch-target flex flex-1 items-center justify-center gap-1 rounded-full px-2 text-sm font-semibold transition-all active:scale-95 ${
    tab === key ? 'bg-white/90 text-warm-600 shadow-[0_6px_14px_rgba(61,44,46,0.055)] ring-1 ring-warm-100/70' : 'text-text-secondary'
  }`}
>
```

- [ ] **Step 5: Verify Home build safety and mark gates**

Run:
```bash
npm exec eslint -- src/pages/HomePage.tsx
npm run build
```
Expected:
- ESLint pass
- Build pass
- Then mark Home 3 gates checked in checklist if visual review passes

- [ ] **Step 6: Commit Home visual rebuild**

```bash
git add src/pages/HomePage.tsx docs/superpowers/checklists/2026-05-09-phase1-visual-gates.md
git commit -m "feat: rebuild home visual hierarchy for phase1"
```

---

### Task 4: Rebuild Couple Space page for consistency/readability

**Files:**
- Modify: `src/pages/CoupleSpacePage.tsx`
- Test: `npm exec eslint -- src/pages/CoupleSpacePage.tsx` and `npm run build`

- [ ] **Step 1: Keep failing gates documented before edits**

Checklist entry:
```md
## Couple Space
- [ ] Atmosphere gate
- [ ] Readability gate
- [ ] Touch gate
```

- [ ] **Step 2: Apply shared typography and clamp classes to grid cards**

```tsx
<h3 className="ui-card-title ui-clamp-1">{item.label}</h3>
<p className="ui-card-desc ui-clamp-2 max-w-[8.5rem]">{item.desc}</p>
```

- [ ] **Step 3: Keep tag/icon spacing stable and safe**

```tsx
<span className="pixel-tag absolute right-3 top-3 ui-clamp-1">{item.tag}</span>
<div className={`pixel-icon-box mb-2 scale-90 origin-left ${item.bg}`}>
  <item.Icon size={20} className={item.color} />
</div>
```

- [ ] **Step 4: Verify and mark Couple Space gates**

Run:
```bash
npm exec eslint -- src/pages/CoupleSpacePage.tsx
npm run build
```
Expected:
- ESLint pass
- Build pass
- Mark 3 Couple Space gates checked only after visual pass

- [ ] **Step 5: Commit Couple Space rebuild**

```bash
git add src/pages/CoupleSpacePage.tsx docs/superpowers/checklists/2026-05-09-phase1-visual-gates.md
git commit -m "feat: align couple-space visuals with phase1 design system"
```

---

### Task 5: Rebuild Interact page and complete phase gate

**Files:**
- Modify: `src/pages/InteractPage.tsx`
- Test: `npm exec eslint -- src/pages/InteractPage.tsx` and `npm run build`

- [ ] **Step 1: Keep failing Interact gates documented before edits**

Checklist entry:
```md
## Interact
- [ ] Atmosphere gate
- [ ] Readability gate
- [ ] Touch gate
```

- [ ] **Step 2: Apply shared title/desc classes to interaction cards**

```tsx
<h3 className="ui-card-title ui-clamp-1">{g.title}</h3>
<p className="ui-card-desc ui-clamp-2 max-w-[8.2rem]">{g.desc}</p>
```

- [ ] **Step 3: Ensure tag and tapability consistency**

```tsx
<button
  key={g.key}
  onClick={() => navigate(`/interact/${g.key}`)}
  className="pixel-card card-pressable relative min-h-0 overflow-hidden p-3 text-left ui-touch-target"
>
  <span className={`pixel-tag absolute right-3 top-3 ${g.type === 'remote' ? 'text-blue-500' : 'text-pink-500'} ui-clamp-1`}>
    {g.tag}
  </span>
```

- [ ] **Step 4: Verify and mark Interact gates**

Run:
```bash
npm exec eslint -- src/pages/InteractPage.tsx
npm run build
```
Expected:
- ESLint pass
- Build pass
- Mark 3 Interact gates checked only after visual pass

- [ ] **Step 5: Commit Interact rebuild**

```bash
git add src/pages/InteractPage.tsx docs/superpowers/checklists/2026-05-09-phase1-visual-gates.md
git commit -m "feat: rebuild interact page visuals for phase1"
```

---

### Task 6: Cross-page regression, deployment check, and release

**Files:**
- Modify: `docs/superpowers/checklists/2026-05-09-phase1-visual-gates.md`
- Verify: `src/pages/HomePage.tsx`, `src/pages/CoupleSpacePage.tsx`, `src/pages/InteractPage.tsx`, `src/styles/index.css`

- [ ] **Step 1: Run final targeted lint on all changed files**

Run:
```bash
npm exec eslint -- src/pages/HomePage.tsx src/pages/CoupleSpacePage.tsx src/pages/InteractPage.tsx
```
Expected: exit 0

- [ ] **Step 2: Run production build**

Run:
```bash
npm run build
```
Expected:
- Build completes successfully
- Accept non-blocking chunk-size warning only

- [ ] **Step 3: Run manual visual regression sweep**

Checklist to execute:
```md
- Home: atmosphere/readability/touch all pass
- Couple Space: atmosphere/readability/touch all pass
- Interact: atmosphere/readability/touch all pass
- Main screens remain fixed (no unexpected whole-page scroll)
- Text never clips card borders on 375x812 viewport
```

- [ ] **Step 4: Deploy production release**

Run:
```bash
npx vercel "C:/Users/weirenminfuwu/Desktop/小程序/qinggan-weihu-v2" --prod --yes
```
Expected:
- Deployment ready
- Production alias resolves

- [ ] **Step 5: Commit regression checklist and release notes**

```bash
git add docs/superpowers/checklists/2026-05-09-phase1-visual-gates.md
git commit -m "chore: complete phase1 visual gates and release checks"
```

---

## Spec Coverage Cross-Check

- Spec §1/§2/§6 (3-page visual rebuild, no logic rewrite): Covered by Tasks 3/4/5 and file boundaries.
- Spec §5 (shared visual system): Covered by Task 2.
- Spec §8 (page-by-page low-risk rollout): Covered by task sequence and per-page gates.
- Spec §9.5 priority gates (atmosphere/readability/touch): Covered by Tasks 1/3/4/5/6 checklist flow.
- Spec §11 minimal state strategy: Covered by Home long-text handling in Task 3 and non-blocking gate language.

## Placeholder/Consistency Self-Review

- Placeholder scan: No TBD/TODO placeholders remain.
- Naming consistency: Uses the same gate names (atmosphere/readability/touch) across tasks and checklist.
- Scope consistency: Only `HomePage.tsx`, `CoupleSpacePage.tsx`, `InteractPage.tsx`, `index.css`, and checklist docs are included; no backend/schema changes.

