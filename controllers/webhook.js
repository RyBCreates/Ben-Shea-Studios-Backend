const Stripe = require("stripe");
const ArtItem = require("../models/artItem");

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const handleStripeWebhook = async (req, res) => {
  console.log("🔔 Webhook hit!");

  console.log("Headers:", req.headers);
  console.log("Raw body length:", req.body.length);

  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log("✔ Stripe event verified");
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return res.status(400).send("Webhook Error");
  }

  console.log("Event type:", event.type);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    console.log("Session object from webhook:", session);
    console.log("🔑 SESSION ID:", session.id);
    console.log("🔗 SUCCESS URL:", session.success_url);
    console.log("📦 METADATA:", session.metadata);

    const originalIds = session.metadata?.originalItemIds
      ?.split(",")
      .filter(Boolean);

    console.log("Original IDs parsed from metadata:", originalIds);

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
