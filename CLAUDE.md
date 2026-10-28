# CLAUDE.md

Este arquivo fornece orientações ao Claude Code (claude.ai/code) ao trabalhar com o código deste repositório.

## Comandos

```bash
npm run dev     # next dev
npm run build   # next build
npm run start   # next start
npm run lint    # eslint (flat config, eslint.config.mjs)
npx tsc --noEmit  # checagem de tipos; não existe script de typecheck
```

Não há suíte de testes. `tsc_output.txt` é um dump de checagem de tipos desatualizado e commitado (UTF-16); ignore-o.

## Stack

Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4, Firebase (Auth + Firestore, SDK de cliente), Stripe, blog em MDX. O alias de caminho `@/*` aponta para a raiz do repositório (sem `src/`). A interface é em português (`<html lang="pt-br">`); comentários no código e algumas mensagens de log também estão em português. O `README.md` descreve uma versão antiga do app, gratuita e só com localStorage, e está desatualizado.

Variáveis de ambiente necessárias (`.env.local`): `NEXT_PUBLIC_FIREBASE_*` (API_KEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID), `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_MONTHLY`, `STRIPE_PRICE_LIFETIME`, `NEXT_PUBLIC_BASE_URL`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID`.

## Arquitetura

**Tudo o que o usuário vê usa o Firebase no lado do cliente.** Não há sessão no servidor: `lib/firebase.ts` exporta um único par `auth`/`db` (SDK de cliente) que é usado em componentes de cliente *e* em rotas de API. O Firebase Admin não é usado, então as rotas de API acessam o Firestore com o SDK de cliente e ficam sujeitas às regras de segurança do Firestore.

**`contexts/AuthContext.tsx` é o hub central de estado**, montado em `app/layout.tsx` envolvendo todo o app (junto com o `AppDock` global e o `CookieBanner`). Use com `useAuth()`. Ele:
- acompanha o usuário do Firebase via `onAuthStateChanged`;
- assina com `onSnapshot` o documento `users/{uid}` e deriva dele `isPremium`, `plan` (`monthly` | `lifetime`), `badges`, `displayName`, `preferences` e `timerSettings`;
- expõe funções `update*` que fazem `setDoc(..., { merge: true })` com estado local otimista.
- **Modo convidado:** sem usuário, `timerSettings` fica no `localStorage` (`focux-guest-settings`) e `updatePreferences`/`updateDisplayName` não fazem nada. Proteja páginas restritas com `components/AuthGuard.tsx`.

**Estrutura do Firestore:** `users/{uid}` (email, isPremium, plan, badges, displayName, preferences, timerSettings, stripeCustomerId, subscriptionId, createdAt) e a subcoleção `users/{uid}/sessions` (gravada por `saveSession` em `lib/db.ts`; `getUserSessions` retorna as 100 mais recentes ordenadas por `completedAt` e alimenta `/analytics` e `/account`). `lib/auth.ts` reúne os helpers de login/registro/Google/logout; `register` cria o documento base `users/{uid}`. `saveSession` engole erros silenciosamente.

**Fluxo Premium / Stripe:**
1. `/upgrade` chama `POST /api/checkout` com `{ plan, userId, userEmail }`; a rota escolhe o preço a partir de `STRIPE_PRICE_MONTHLY`/`STRIPE_PRICE_LIFETIME` (modo `subscription` vs `payment`) e coloca `userId` + `plan` nos metadados da sessão.
2. `POST /api/webhooks/stripe` verifica a assinatura e, em `checkout.session.completed`, grava `isPremium`, `plan`, `stripeCustomerId`, `subscriptionId` (e o badge `early-supporter` para lifetime) em `users/{userId}`. Este é o único lugar onde o premium é concedido. Apenas esse evento é tratado (sem tratamento de cancelamento/renovação).
3. `POST /api/portal` busca o `stripeCustomerId` no documento do usuário para abrir o portal de cobrança do Stripe.
A string de `apiVersion` do Stripe (`2026-01-28.clover`) está fixa em cada uma das três rotas.

**Timer (`components/Timer.tsx`, renderizado por `app/page.tsx`)**: a funcionalidade principal. Persiste o estado em andamento no `localStorage` (`STORAGE_KEY`) para sobreviver a recarregamentos, obtém as durações de `timerSettings`, respeita `preferences` (som/notificações/volume) e chama `saveSession` para usuários logados quando uma sessão termina.

**Blog:** `lib/mdx.ts` lê `posts/*.mdx` do disco com `gray-matter` (frontmatter: `title`, `date`, `description`), ordenado por data decrescente; renderizado com `next-mdx-remote` em `app/blog/[slug]/page.tsx`.

**Componentes de UI:** `components/ui/*` são primitivos no estilo shadcn / Magic UI (veja `components.json`); `lightswind`, `motion`/`framer-motion` e `recharts` (gráficos de analytics em `components/analytics/`) são usados nos visuais. Componentes de nível de app ficam direto em `components/`.
