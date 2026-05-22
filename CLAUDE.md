# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Run commands from `qinggan-weihu-v2/`.

```bash
npm install
npm run dev
npm run build
npm run lint
npm run preview
```

Scoped lint for changed files:

```bash
npm exec eslint -- src/pages/EmotionStationPage.tsx src/App.tsx
```

### Test status

This repository currently has no `test` script and no `*.test.*` / `*.spec.*` test files configured.

- There is no single-test command at the moment.
- Use `npm run build` (TypeScript + Vite build) plus scoped/full lint as the verification baseline.

## Architecture (big picture)

## Runtime shell and navigation

- Entry: `src/main.tsx` mounts `<App />`, imports global styles, and registers the PWA service worker update cycle.
- App shell: `src/App.tsx` is the central orchestrator for:
  - onboarding/identity bootstrap,
  - old local-data migration gate,
  - header + bottom navigation + menu overlay,
  - page rendering.
- Navigation is state-driven (string routes in component state), not React Router runtime routing.

## Data model and persistence boundaries

- Cloud data client: `src/supabase.ts` (single shared Supabase client via `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`).
- Local identity/session data: hooks under `src/hooks/` (notably `useIdentity.ts`, `useMigration.ts`, `useCoupleEmotionState.ts`).
- Realtime updates: `src/hooks/useRealtime.ts` wraps Supabase channel subscriptions.
- Static product content (question banks, phrase sets, emotion state metadata) is under `src/data/`.

## Feature decomposition

- Page-level feature modules live in `src/pages/` (home, couple space, interact, settings, emotion station, etc.).
- Interactive mini-modules are split under `src/components/interact/` and rendered by `App.tsx` route branches.
- Shared shell UI primitives live in `src/components/ui/`.

## Styling system

- Global styles are centralized in `src/styles/index.css`.
- The app is mobile-first and constrained to a centered single-column viewport; many layouts assume this shell.
- Emotion subpages (`/emotion/*`) use dedicated full-screen style branches inside the same global stylesheet and are routed from `App.tsx`.

## PWA and push pipeline

- Build/runtime PWA config: `vite.config.ts` (`vite-plugin-pwa`, `injectManifest` strategy).
- Service worker source: `src/sw.ts`.
- Vercel serverless push endpoints: `api/push-event.js`, `api/push-dispatch.js`.
- Vercel cron schedule and SW/manifest cache headers: `vercel.json`.

## Schema and backend evolution

- SQL migration history is tracked in `supabase/` (`migrations.sql`, `migrations_v*.sql`).
- When changing cloud-backed behavior, keep frontend changes and SQL migration updates aligned.

## Repo notes

- `README.md` is currently the default Vite template and does not document project-specific behavior.
- No `.cursorrules`, `.cursor/rules/`, or `.github/copilot-instructions.md` are present in this repository at the time of writing.
