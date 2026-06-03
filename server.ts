import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY environment variable is required');
  }
  return new Stripe(key, { apiVersion: '2025-02-24.acacia' as any });
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3003;

  app.use(express.json());

  // API routes
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { planId } = req.body;
      
      const stripe = getStripe();

      let amount = 0;
      if (planId === 'bronze') amount = 499; // $4.99
      else if (planId === 'silver') amount = 1499; // $14.99
      else if (planId === 'gold') amount = 2999; // $29.99
      else amount = 1000; // default

      // Create a PaymentIntent with the order amount and currency
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: "usd",
        automatic_payment_methods: {
          enabled: true,
        },
      });

      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (err: any) {
      if (err.message.includes('STRIPE_SECRET_KEY')) {
         // Return a mock clientSecret for UI purposes since we don't have keys in preview usually
         // Users must provide their own key to actually work.
         res.send({
           clientSecret: 'mock_client_secret_for_ui_only_because_api_key_missing'
         });
      } else {
         res.status(500).json({ error: err.message });
      }
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
