const Stripe = require("stripe");
const Order = require("../models/order");

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const createCheckout = async (req, res) => {
  try {
    const { customerInfo, cartList, discountValue } = req.body;

    if (!Array.isArray(cartList) || cartList.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const TAX_RATE = 0.07;
    const MAX_DISCOUNT = 25;

    const safeDiscount =
      typeof discountValue === "number"
        ? Math.min(Math.max(discountValue, 0), MAX_DISCOUNT)
        : 0;

    const subtotal = cartList.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const discountedSubtotal = subtotal * (1 - safeDiscount / 100);
    const tax = Number((discountedSubtotal * TAX_RATE).toFixed(2));
    const totalAmount = Number((discountedSubtotal + tax).toFixed(2));

    /** 1️⃣ Create order (pending) */
    const order = await Order.create({
      ...customerInfo,
      cartList,
      subtotal,
      tax,
      discount: safeDiscount,
      totalAmount,
      status: "pending",
    });

    /** 2️⃣ Stripe line items */
    const line_items = cartList.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.title, images: [item.image] },
        unit_amount: Math.round(item.price * (1 - safeDiscount / 100) * 100),
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: "usd",
        product_data: { name: "Sales Tax (7%)" },
        unit_amount: Math.round(tax * 100),
      },
      quantity: 1,
    });

    const frontendBaseUrl =
      process.env.NODE_ENV === "development"
        ? "http://localhost:5173"
        : "https://bensheastudio.com";

    /** 3️⃣ Stripe session */
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      billing_address_collection: "required",
      line_items,
      metadata: {
        orderId: order._id.toString(),
      },
      success_url: `${frontendBaseUrl}/success`,
      cancel_url: `${frontendBaseUrl}/cancel`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout failed:", err);
    res.status(500).json({ error: "Checkout failed" });
  }
};

module.exports = { createCheckout };
