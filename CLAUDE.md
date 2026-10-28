# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev     # next dev
npm run build   # next build
npm run start   # next start
npm run lint    # eslint (flat config, eslint.config.mjs)
npx tsc --noEmit  # type-check; there is no typecheck script
```

There is no test suite. `tsc_output.txt` is a stale committed type-check dump (UTF-16); ignore it.

## Stack

Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4, Firebase (Auth + Firestore, client SDK), Stripe, MDX blog. Path alias `@/*` maps to the repo root (no `src/`). UI is Portuguese (`<html lang="pt-br">`); code comments and some log strings are also Portuguese. `README.md` describes an older, free/localStorage-only version of the app and is outdated.

Required env vars (`.env.local`): `NEXT_PUBLIC_FIREBASE_*` (API_KEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID), `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_MONTHLY`, `STRIPE_PRICE_LIFETIME`, `NEXT_PUBLIC_BASE_URL`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID`.

## Architecture

**Everything user-facing is client-side Firebase.** There is no server-side session: `lib/firebase.ts` exports a single `auth`/`db` pair (client SDK) that is used from client components *and* from API routes. Firebase Admin is not used, so API routes talk to Firestore with the client SDK and are subject to Firestore security rules.

**`contexts/AuthContext.tsx` is the central state hub**, mounted in `app/layout.tsx` around the whole app (alongside the global `AppDock` and `CookieBanner`). Consume it with `useAuth()`. It:
- tracks the Firebase user via `onAuthStateChanged`;
- subscribes with `onSnapshot` to `users/{uid}` and derives `isPremium`, `plan` (`monthly` | `lifetime`), `badges`, `displayName`, `preferences`, and `timerSettings` from that one document;
- exposes `update*` writers that `setDoc(..., { merge: true })` with optimistic local state.
- **Guest mode:** with no user, `timerSettings` live in `localStorage` (`focux-guest-settings`) and `updatePreferences`/`updateDisplayName` are no-ops. Gate protected pages with `components/AuthGuard.tsx`.

**Firestore layout:** `users/{uid}` (email, isPremium, plan, badges, displayName, preferences, timerSettings, stripeCustomerId, subscriptionId, createdAt) and subcollection `users/{uid}/sessions` (written by `saveSession` in `lib/db.ts`; `getUserSessions` returns the latest 100 ordered by `completedAt` and feeds `/analytics` and `/account`). `lib/auth.ts` holds login/register/Google/logout helpers; `register` creates the base `users/{uid}` doc. `saveSession` swallows errors silently.

**Premium / Stripe flow:**
1. `/upgrade` calls `POST /api/checkout` with `{ plan, userId, userEmail }`; the route picks the price from `STRIPE_PRICE_MONTHLY`/`STRIPE_PRICE_LIFETIME` (`subscription` vs `payment` mode) and puts `userId` + `plan` in session metadata.
2. `POST /api/webhooks/stripe` verifies the signature and, on `checkout.session.completed`, writes `isPremium`, `plan`, `stripeCustomerId`, `subscriptionId` (and the `early-supporter` badge for lifetime) to `users/{userId}`. This is the only place premium is granted. Only that one event is handled (no cancellation/renewal handling).
3. `POST /api/portal` looks up `stripeCustomerId` on the user doc to open the Stripe billing portal.
The Stripe `apiVersion` string (`2026-01-28.clover`) is hard-coded in each of the three routes.

**Timer (`components/Timer.tsx`, rendered by `app/page.tsx`)**: the core feature. Persists in-progress state to `localStorage` (`STORAGE_KEY`) so it survives reloads, takes durations from `timerSettings`, honours `preferences` (sound/notifications/volume), and calls `saveSession` for logged-in users when a session completes.

**Blog:** `lib/mdx.ts` reads `posts/*.mdx` from disk with `gray-matter` (frontmatter: `title`, `date`, `description`), sorted by date desc; rendered with `next-mdx-remote` in `app/blog/[slug]/page.tsx`.
**UI components:** `components/ui/*` are shadcn-style / Magic UI primitives (see `components.json`); `lightswind`, `motion`/`framer-motion`, and `recharts` (analytics charts in `components/analytics/`) are used for visuals. App-level components live directly in `components/`.
