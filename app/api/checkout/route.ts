import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover", // Using latest API version
});

export async function POST(req: Request) {
  try {
    const { plan, userId, userEmail } = await req.json();

    if (!userId || !plan) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    let priceId;
    let mode: Stripe.Checkout.SessionCreateParams.Mode;

    if (plan === "monthly") {
      priceId = process.env.STRIPE_PRICE_MONTHLY;
      mode = "subscription";
    } else if (plan === "lifetime") {
      priceId = process.env.STRIPE_PRICE_LIFETIME;
      mode = "payment";
    } else {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    if (!priceId) {
      return NextResponse.json(
        { error: "Price logic not configured in .env" },
        { status: 500 },
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: mode,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/upgrade?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/upgrade?canceled=true`,
      customer_email: userEmail, // Pre-fills email
      metadata: {
        userId: userId,
        plan: plan,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
