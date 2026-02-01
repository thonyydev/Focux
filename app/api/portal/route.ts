import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Buscar customerId no Firestore
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userData = userSnap.data();
    const stripeCustomerId = userData?.stripeCustomerId;

    if (!stripeCustomerId) {
      // Fallback: Tries to find customer by email if not saved
      if (userData.email) {
        const customers = await stripe.customers.list({
          email: userData.email,
          limit: 1,
        });
        if (customers.data.length > 0) {
          // Found by email, use this ID
          const portalSession = await stripe.billingPortal.sessions.create({
            customer: customers.data[0].id,
            return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/account`,
          });
          return NextResponse.json({ url: portalSession.url });
        }
      }

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
