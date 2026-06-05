import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { plan, priceId } = await req.json();

  if (!priceId) {
    return NextResponse.json({ error: "No price ID" }, { status: 400 });
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${stripeKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      mode: "subscription",
      "line_items[0][price]": priceId,
      "line_items[0][quantity]": "1",
      success_url: `${baseUrl}/dashboard?upgrade=success`,
      cancel_url: `${baseUrl}/pricing`,
      "metadata[plan]": plan,
    }),
  });

  const session = await response.json();

  if (session.url) {
    return NextResponse.json({ url: session.url });
  }

  return NextResponse.json({ error: "Could not create session" }, { status: 500 });
}