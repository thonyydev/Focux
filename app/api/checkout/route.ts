import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { getAuthedUser } from "@/lib/api-auth";

export async function POST(req: Request) {
  try {
    const user = await getAuthedUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan } = await req.json();

    if (!plan) {
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

    const session = await getStripe().checkout.sessions.create({
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
      customer_email: user.email, // Pre-fills email
      metadata: {
        userId: user.uid,
        plan: plan,
      },
      // Os eventos de assinatura (cancelamento/renovação) só carregam os metadados
      // da assinatura, não os da sessão; o webhook usa isso para achar o usuário.
      ...(mode === "subscription" && {
        subscription_data: { metadata: { userId: user.uid } },
      }),
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
