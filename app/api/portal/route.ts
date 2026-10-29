import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getAuthedUser } from "@/lib/api-auth";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const user = await getAuthedUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const stripe = getStripe();

    // Buscar customerId no Firestore
    const userSnap = await adminDb().doc(`users/${user.uid}`).get();

    if (!userSnap.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userData = userSnap.data();
    let stripeCustomerId = userData?.stripeCustomerId;

    if (!stripeCustomerId) {
      // Fallback: Tries to find customer by email if not saved
      const email = userData?.email || user.email;
      if (email) {
        const customers = await stripe.customers.list({ email, limit: 1 });
        stripeCustomerId = customers.data[0]?.id;
      }
    }

    if (!stripeCustomerId) {
      return NextResponse.json(
        { error: "No Stripe Customer found for this user" },
        { status: 404 },
      );
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/account`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe Portal Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
