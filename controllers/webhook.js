const Stripe = require("stripe");
const ArtItem = require("../models/artItem");

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return res.status(400).send("Webhook Error");
  }

  console.log("Event type:", event.type);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const originalIds = session.metadata?.originalItemIds
      ?.split(",")
      .filter(Boolean);

    if (originalIds?.length) {
      const result = await ArtItem.updateMany(
        { _id: { $in: originalIds } },
        { "original.sold": true }
      );
      console.log("DB update result:", result);
    } else {
      console.log("⚠ No original IDs found in metadata");
    }
  }

  res.json({ received: true });
};

module.exports = { handleStripeWebhook };
