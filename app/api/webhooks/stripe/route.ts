import { NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 },
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const plan = session.metadata?.plan;

    if (userId && plan) {
      const userRef = doc(db, "users", userId);
      const updates: any = {
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

      await setDoc(userRef, updates, { merge: true });
      console.log(`User ${userId} upgraded to ${plan}`);
    }
  }

  return NextResponse.json({ received: true });
}
