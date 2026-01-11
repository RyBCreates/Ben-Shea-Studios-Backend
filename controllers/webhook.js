const Stripe = require("stripe");
const ArtItem = require("../models/artItem");
const Order = require("../models/order");

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
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send("Webhook Error");
  }

  console.log("Event type:", event.type);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const orderId = session.metadata?.orderId;

    if (!orderId) {
      console.error("Missing orderId in Stripe metadata");
      return res.json({ received: true });
    }
    const order = await Order.findById(orderId);

    if (!order) {
      console.error("Order not found:", orderId);
      return res.json({ received: true });
    }

    if (order.status !== "paid" && session.payment_status === "paid") {
      await Order.findByIdAndUpdate(orderId, {
        status: "paid",
        paidAt: new Date(),
      });

      const originalIds = session.metadata?.originalItemIds
        ?.split(",")
        .filter(Boolean);

      if (originalIds?.length) {
        await ArtItem.updateMany(
          { _id: { $in: originalIds } },
          { "original.sold": true }
        );
      }
    }

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
      console.log("No original IDs found in metadata");
    }
  }

  res.json({ received: true });
};

module.exports = { handleStripeWebhook };
