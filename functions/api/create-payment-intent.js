const PLAN_AMOUNTS = {
  bronze: 499,
  silver: 1499,
  gold: 2999,
};

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const body = await request.json();
    const planId = body?.planId;
    const amount = PLAN_AMOUNTS[planId] ?? 1000;
    const key = env.STRIPE_SECRET_KEY;

    if (!key) {
      return Response.json({
        clientSecret: "mock_client_secret_for_ui_only_because_api_key_missing",
      });
    }

    const params = new URLSearchParams({
      amount: String(amount),
      currency: "usd",
      "automatic_payment_methods[enabled]": "true",
    });

    const stripeRes = await fetch("https://api.stripe.com/v1/payment_intents", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const data = await stripeRes.json();
    if (!stripeRes.ok) {
      return Response.json({ error: data.error?.message || "Stripe error" }, { status: 500 });
    }

    return Response.json({ clientSecret: data.client_secret });
  } catch (err) {
    return Response.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
