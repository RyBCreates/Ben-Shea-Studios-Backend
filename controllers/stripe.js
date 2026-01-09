const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const createCheckout = async (req, res) => {
  try {
    const { cartList, discountValue } = req.body;

    console.log("💳 Checkout request received. Cart list:", cartList);

    const totalAmount = cartList.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const discountedTotal = totalAmount * (1 - discountValue / 100);
    const TAX_RATE = 0.07;
    const tax = Number((discountedTotal * TAX_RATE).toFixed(2));

    const originalItemIds = cartList
      .filter((item) => item.version === "original")
      .map((item) => item._id)
      .join(",");

    console.log("📝 Original item IDs being sent to Stripe:", originalItemIds);

    const line_items = [
      ...cartList.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: { name: item.title, images: [item.image] },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      {
        price_data: {
          currency: "usd",
          product_data: { name: "Tax" },
          unit_amount: Math.round(tax * 100),
        },
        quantity: 1,
      },
    ];

    const isDev = process.env.NODE_ENV === "development";

    const frontendBaseUrl = isDev
      ? "http://localhost:5173"
      : "https://bensheastudio.com";

    const metadata =
      typeof originalItemIds === "string" && originalItemIds.length > 0
        ? { originalItemIds }
        : {};

    console.log("🧪 Metadata being sent to Stripe:", metadata);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      metadata, // only non-empty
      success_url: `${frontendBaseUrl}/success`,
      cancel_url: `${frontendBaseUrl}/cancel`,
    });

    console.log("✅ Stripe session created:", session.id);

    res.json({ url: session.url });
  } catch (err) {
    console.error("❌ Stripe checkout failed:", err);
    res.status(500).json({ error: "Stripe checkout failed" });
  }
};

module.exports = { createCheckout };
