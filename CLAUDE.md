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

Não há runner de testes. A lógica de dias seguidos (`lib/stats.ts`) e o gerador de ruído (`lib/noise.ts`) têm autotestes: `node lib/stats.test.mjs` e `node lib/noise.test.mjs` (Node 22.6+ lê o `.ts` direto). `tsc_output.txt` é um dump de checagem de tipos desatualizado e commitado (UTF-16); ignore-o.

## Stack

Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4, Firebase (Auth + Firestore, SDK de cliente), Stripe, blog em MDX. O alias de caminho `@/*` aponta para a raiz do repositório (sem `src/`). A interface é em português (`<html lang="pt-br">`); comentários no código e algumas mensagens de log também estão em português.
Variáveis de ambiente necessárias (`.env.local`): `NEXT_PUBLIC_FIREBASE_*` (API_KEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID), `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_MONTHLY`, `STRIPE_PRICE_LIFETIME`, `NEXT_PUBLIC_BASE_URL`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID`, `FIREBASE_SERVICE_ACCOUNT` (JSON da conta de serviço, só servidor).

## Arquitetura

**O navegador usa o Firebase com o SDK de cliente; o servidor usa o Admin SDK.** `lib/firebase.ts` exporta o par `auth`/`db` (cliente) e fica restrito a componentes de cliente. As rotas de API usam `lib/firebase-admin.ts` (`adminAuth()`/`adminDb()`, credencial na variável `FIREBASE_SERVICE_ACCOUNT`) e identificam o usuário com `getAuthedUser(req)` de `lib/api-auth.ts`, que verifica o ID token enviado em `Authorization: Bearer <token>`. As rotas **nunca** devem confiar em `userId` vindo do corpo da requisição. O Admin SDK ignora as regras do Firestore; as regras do navegador ficam em `firestore.rules` (colar manualmente no Firebase Console) e impedem o usuário de gravar campos de Premium.

**`contexts/AuthContext.tsx` é o hub central de estado**, montado em `app/layout.tsx` envolvendo todo o app (junto com o `AppDock` global e o `CookieBanner`). Use com `useAuth()`. Ele:
- acompanha o usuário do Firebase via `onAuthStateChanged`;
- assina com `onSnapshot` o documento `users/{uid}` e deriva dele `isPremium`, `plan` (`monthly` | `lifetime`), `badges`, `displayName`, `preferences` e `timerSettings`;
- expõe funções `update*` que fazem `setDoc(..., { merge: true })` com estado local otimista.
- **Modo convidado:** sem usuário, `timerSettings` fica no `localStorage` (`focux-guest-settings`) e `updatePreferences`/`updateDisplayName` não fazem nada. Proteja páginas restritas com `components/AuthGuard.tsx`.

**Estrutura do Firestore:** `users/{uid}` (email, isPremium, plan, badges, displayName, preferences, timerSettings, stripeCustomerId, subscriptionId, createdAt) `users/{uid}/tasks` (title, done, createdAt; ouvida em tempo real por `subscribeTasks`) e a subcoleção `users/{uid}/sessions` (gravada por `saveSession` em `lib/db.ts`, com `taskId` opcional quando há tarefa em foco — nunca gravar campos `undefined`: o Firestore rejeita e `saveSession` engole o erro; `useSessions` em `lib/useSessions.ts` é a versão em tempo real, usada pelo progresso diário e pela lista de tarefas; `getUserSessions` retorna as 100 mais recentes ordenadas por `completedAt` e alimenta `/analytics` e `/account`). `lib/auth.ts` reúne os helpers de login/registro/Google/logout; `register` cria o documento base `users/{uid}`. `saveSession` engole erros silenciosamente. `preferences` inclui `dailyGoalMinutes` e é mesclada com `DEFAULT_PREFERENCES` em `AuthContext`, para usuários antigos receberem campos novos.

**Fluxo Premium / Stripe:**
1. `/upgrade` chama `POST /api/checkout` com `{ plan }` e o token de login; a rota escolhe o preço a partir de `STRIPE_PRICE_MONTHLY`/`STRIPE_PRICE_LIFETIME` (modo `subscription` vs `payment`) e coloca `userId` + `plan` nos metadados da sessão (e `userId` também nos da assinatura).
2. `POST /api/webhooks/stripe` verifica a assinatura e, em `checkout.session.completed`, grava `isPremium`, `plan`, `stripeCustomerId`, `subscriptionId` (e o badge `early-supporter` para lifetime) em `users/{userId}`. Este é o único lugar onde o premium é concedido. `customer.subscription.updated` (status fora de active/trialing/past_due) e `customer.subscription.deleted` revogam o Premium mensal, só se a assinatura for a atual do usuário (`subscriptionId`); o vitalício nunca é revogado.
3. `POST /api/portal` busca o `stripeCustomerId` do usuário logado para abrir o portal de cobrança do Stripe.
O cliente do Stripe vem de `getStripe()` em `lib/stripe.ts`, criado sob demanda (instanciar no topo do módulo quebra o build quando a chave não existe). A `apiVersion` fica só ali.

**Timer (`components/Timer.tsx`, renderizado por `components/Dashboard.tsx`, que guarda a tarefa em foco (`activeTaskId`, passada ao Timer por prop) e mostra meta diária e tarefas numa coluna ao lado para usuários logados)**: a funcionalidade principal. Persiste o estado em andamento no `localStorage` (`STORAGE_KEY`) para sobreviver a recarregamentos, obtém as durações de `timerSettings`, respeita `preferences` (som/notificações; `volume` só afeta o som ambiente), toca som ambiente durante o foco (`lib/useAmbientSound.ts`, ruído gerado com Web Audio, sem arquivos), atende atalhos de teclado e mostra o tempo no título da aba e chama `saveSession` para usuários logados quando uma sessão termina.

**Blog:** `lib/mdx.ts` lê `posts/*.mdx` do disco com `gray-matter` (frontmatter: `title`, `date`, `description`), ordenado por data decrescente; renderizado com `next-mdx-remote` em `app/blog/[slug]/page.tsx`.

**Design system (só escuro):** os tokens vivem em `app/globals.css` (um único conjunto em `:root`; `<html class="dark">` mantém as variantes `dark:` de `components/ui/`). Use as classes dos tokens, nunca `neutral-*`/`gray-*`: superfícies `bg-background` < `bg-card` < `bg-secondary` < `bg-accent`; texto `text-foreground` > `text-muted-foreground` > `text-subtle`; linhas `border-border` (e `border-input` para as mais fortes); marca verde `bg-primary` com `text-primary-foreground` (texto escuro sobre o verde, para contraste); cores dos modos do timer `focus`/`break`/`long-break` e do plano Premium `premium` (ex.: `bg-focus`, `text-break`, `shadow-premium/25`). CTAs usam `Button` de `components/ui/button.tsx` (`size="xl"` nos de destaque). Ao mudar uma cor, mude o token. Depois de alterar `globals.css` com o dev server rodando, reinicie-o se as cores parecerem as antigas (o cache do Turbopack pode ficar velho, principalmente após `git stash`).

**Componentes de UI:** `components/ui/*` são primitivos no estilo shadcn / Magic UI (veja `components.json`); `lightswind`, `motion`/`framer-motion` e `recharts` (gráficos de analytics em `components/analytics/`) são usados nos visuais. Componentes de nível de app ficam direto em `components/`.
