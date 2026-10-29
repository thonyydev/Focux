# [Focux](https://focux.app/)

A minimalist and elegant Pomodoro timer to maximize your productivity.

## 📋 About The Project

**Focux** is a Pomodoro timer web app (Brazilian Portuguese interface) built to help you stay focused. The core timer is free and ad-free, works without an account, and an optional **Premium** plan adds focus analytics and cloud history while supporting the project's development.

### ✨ Why Focux?

- **Simplicity first**: clean interface without distractions
- **Free core, no ads**: the timer never needs a paywall or ads
- **Works as a guest**: no account needed to use the timer
- **Your data follows you**: sign in to keep settings, preferences and session history in the cloud
- **Measurable focus**: levels, stats and (with Premium) analytics

## 🚀 Features

### ⏱️ Pomodoro Timer

- Focus, short break and long break modes (defaults: 25 / 5 / 15 minutes)
- Fully customizable durations in the timer settings
- Progress saved in the browser, so you can resume after reloading or closing the tab
- Sound alerts and browser notifications when a session ends (each can be toggled)
- Confetti celebration when you complete focus sessions
- Ambient sound while you focus (white noise, brown noise or rain, generated in the browser)
- Keyboard shortcuts: `Space` start/pause, `R` reset, `1` / `2` / `3` switch mode
- The remaining time shows in the browser tab title

### ✅ Tasks, daily goal and streak (logged-in users)

- Add tasks, mark them done, and pick the one you are focusing on: each completed focus session is linked to it, and the task shows how many sessions it took (🍅)
- Daily focus goal in minutes (default 120, adjustable in **My Account**) with a progress bar on the home screen
- Streak: consecutive days with at least one focus session (today still counts as open until the day ends)

### 👤 Accounts

- Sign up and log in with email and password, or with Google
- Guests keep their timer settings in the browser; logged-in users have them synced through Firestore
- Completed sessions are saved to your account
- **My Account** page with:
  - Personal focus stats and a level based on your total focus time (Iniciante, Focado, Veterano, Mestre, Lendário)
  - Display name, sound and notification preferences
  - Your current plan, badges and billing management

### 💎 Premium

| Plan | Price | Includes |
| --- | --- | --- |
| Monthly | R$ 9,90 / month | Analytics, cloud history, device sync. Cancel any time. |
| Lifetime | R$ 34,90 one-time | Everything in Monthly, early supporter badge, early access to new features, priority support. |

- Payments are handled by [Stripe](https://stripe.com/) Checkout; subscribers manage or cancel through the Stripe billing portal
- Premium is granted by a Stripe webhook after a successful checkout, and revoked when a monthly subscription is canceled or stops being paid

### 📊 Analytics (Premium)

- Total focused time, completed sessions and days with recorded focus
- Weekly focus chart
- Recent session history

### 📝 Blog

Product news and updates, written in MDX (`posts/*.mdx`) and published at `/blog`.

### 🔎 SEO & discoverability

- Per-page metadata, canonical URLs, Open Graph and Twitter cards
- `sitemap.xml`, `robots.txt` and an `llms.txt` summary for AI assistants
- Structured data (JSON-LD) for the site, FAQ and blog posts
- Private pages (account, analytics, auth) are marked `noindex`

### 🍪 Privacy

A cookie banner asks for consent; Google Analytics only loads after you accept.

## 🎯 How to Use

### Basic Pomodoro Technique

1. **Choose a task** you want to complete
2. **Start a focus session** (25 minutes by default)
3. **Work with dedication** until the timer rings
4. **Take a short break** (5 minutes by default)
5. **Repeat** the process
6. After **4 focus sessions**, take a **long break** (15 minutes by default)

## 🛠️ Built With

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router) and React 19
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v4
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) and Magic UI
- **Animations**: Motion (Framer Motion)
- **Charts**: [Recharts](https://recharts.org/)
- **Auth & Database**: [Firebase](https://firebase.google.com/) (Authentication and Firestore)
- **Payments**: [Stripe](https://stripe.com/)
- **Blog**: MDX with `next-mdx-remote` and `gray-matter`
- **Icons**: [Lucide Icons](https://lucide.dev/)

## 💻 Running Locally

```bash
npm install
npm run dev
```

The app runs at [http://localhost:3000](http://localhost:3000). Create a `.env.local` file with:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`, `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`, `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase web app config |
| `STRIPE_SECRET_KEY` | Stripe secret key (server only) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_PRICE_MONTHLY`, `STRIPE_PRICE_LIFETIME` | Stripe price IDs for each plan |
| `STRIPE_WEBHOOK_SECRET` | Signing secret of the webhook endpoint |
| `FIREBASE_SERVICE_ACCOUNT` | Firebase service account JSON (one line, server only). Used by the API routes to verify logins and by the Stripe webhook to write Premium status |
| `NEXT_PUBLIC_BASE_URL` | Site URL, used for Stripe redirects (`http://localhost:3000` locally) |
| `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` | Google Analytics measurement ID |

To test Premium locally, forward Stripe events to the webhook endpoint (`/api/webhooks/stripe`; events `checkout.session.completed`, `customer.subscription.updated` and `customer.subscription.deleted`) using the [Stripe CLI](https://docs.stripe.com/stripe-cli) and use the signing secret it prints as `STRIPE_WEBHOOK_SECRET`.

Firestore security rules live in `firestore.rules`; paste them into the Firebase Console (Firestore Database → Rules) when they change.

Other scripts: `npm run build`, `npm run start` and `npm run lint`.

## 🤝 Contributing

Contributions are always welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

Created with ❤️ by **Thonyy Dev**
