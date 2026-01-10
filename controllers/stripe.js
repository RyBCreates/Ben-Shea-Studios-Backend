const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const createCheckout = async (req, res) => {
  try {
    const { cartList, discountValue } = req.body;

    if (!cartList || !Array.isArray(cartList) || cartList.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const MAX_DISCOUNT = 25;
    const TAX_RATE = 0.07; // 7% tax
    const safeDiscount =
      typeof discountValue === "number"
        ? Math.min(Math.max(discountValue, 0), MAX_DISCOUNT)
        : 0;

    const originalItemIds = cartList
      .filter((item) => item.version === "original")
      .map((item) => item._id)
      .join(",");

    const subtotal = cartList.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const discountedSubtotal = subtotal * (1 - safeDiscount / 100);
    const tax = parseFloat((discountedSubtotal * TAX_RATE).toFixed(2));

    const line_items = [
      ...cartList.map((item) => {
        const discountedPrice =
          safeDiscount > 0 ? item.price * (1 - safeDiscount / 100) : item.price;
        return {
          price_data: {
            currency: "usd",
            product_data: { name: item.title, images: [item.image] },
            unit_amount: Math.round(discountedPrice * 100),
          },
          quantity: item.quantity,
        };
      }),
      {
        price_data: {
          currency: "usd",
          product_data: { name: `Sales Tax (7%)` },
          unit_amount: Math.round(tax * 100),
        },
        quantity: 1,
      },
    ];

    const frontendBaseUrl =
      process.env.NODE_ENV === "development"
        ? "http://localhost:5173"
        : "https://bensheastudio.com";

    const metadata = originalItemIds.length > 0 ? { originalItemIds } : {};

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      billing_address_collection: "required",
      mode: "payment",
      metadata,
      success_url: `${frontendBaseUrl}/success`,
      cancel_url: `${frontendBaseUrl}/cancel`,
    });

    // ✅ Return sessionId instead of URL
    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout failed:", err);
    res
      .status(500)
      .json({ error: err.raw?.message || "Stripe checkout failed" });
  }
};

module.exports = { createCheckout };
