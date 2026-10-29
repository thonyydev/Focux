import Stripe from "stripe";

let stripe: Stripe | undefined;

// Criado sob demanda: instanciar no topo do módulo quebra o build quando a
// STRIPE_SECRET_KEY não existe no ambiente (ex.: Vercel sem variáveis).
export function getStripe() {
  return (stripe ??= new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-01-28.clover",
  }));
}
