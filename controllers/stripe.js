const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const createCheckout = async (req, res) => {
  try {
    const { cartList, discountValue } = req.body;

    const totalAmount = cartList.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const discountedTotal = totalAmount * (1 - discountValue / 100);
    const TAX_RATE = 0.07;
    const tax = Number((discountedTotal * TAX_RATE).toFixed(2));

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
      : "https://ben-shea-studios.vercel.app";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${frontendBaseUrl}/success`,
      cancel_url: `${frontendBaseUrl}/cancel`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Stripe checkout failed" });
  }
};

module.exports = {
  createCheckout,
};
