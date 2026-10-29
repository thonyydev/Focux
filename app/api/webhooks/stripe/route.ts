import { NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";
import { getStripe } from "@/lib/stripe";

// Status em que a assinatura mensal ainda dá acesso. past_due mantém o acesso
// enquanto o Stripe tenta cobrar de novo; unpaid/canceled/incomplete_expired revogam.
const ACTIVE_STATUSES: Stripe.Subscription.Status[] = [
  "active",
  "trialing",
  "past_due",
];

async function grantPremium(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  const plan = session.metadata?.plan;
  if (!userId || !plan) return;

  const updates: Record<string, unknown> = {
    isPremium: true,
    plan: plan === "monthly" ? "monthly" : "lifetime",
  };

  if (plan === "lifetime") {
    updates.badges = ["early-supporter"];
  }

  if (session.customer) {
    updates.stripeCustomerId = session.customer;
  }

  // If it's a subscription, we might want to store the subscription ID too
  if (session.subscription) {
    updates.subscriptionId = session.subscription;
  }

  await adminDb().doc(`users/${userId}`).set(updates, { merge: true });
  console.log(`User ${userId} upgraded to ${plan}`);
}

async function revokePremium(subscription: Stripe.Subscription) {
  const db = adminDb();
  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer.id;

  // Assinaturas novas trazem o userId nos metadados; as antigas só têm o customer.
  const userId = subscription.metadata?.userId;
  let userRef = userId ? db.doc(`users/${userId}`) : null;

  if (!userRef) {
    const found = await db
      .collection("users")
      .where("stripeCustomerId", "==", customerId)
      .limit(1)
      .get();
    userRef = found.docs[0]?.ref ?? null;
  }
  if (!userRef) return;

  const data = (await userRef.get()).data();

  // Só revoga se esta for a assinatura atual do usuário. Quem trocou para o
  // plano vitalício (ou assinou de novo) não pode perder o acesso por um evento antigo.
  if (data?.plan !== "monthly" || data?.subscriptionId !== subscription.id) {
    return;
  }

  await userRef.set(
    { isPremium: false, plan: null, subscriptionId: FieldValue.delete() },
    { merge: true },
  );
  console.log(`User ${userRef.id} premium revoked (${subscription.status})`);
}

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 },
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await grantPremium(event.data.object as Stripe.Checkout.Session);
        break;
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        if (!ACTIVE_STATUSES.includes(subscription.status)) {
          await revokePremium(subscription);
        }
        break;
      }
      case "customer.subscription.deleted":
        await revokePremium(event.data.object as Stripe.Subscription);
        break;
    }
  } catch (err) {
    // 500 faz o Stripe tentar entregar o evento de novo
    console.error("Webhook handler error:", err);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
