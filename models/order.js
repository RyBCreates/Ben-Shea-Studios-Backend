const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    fullName: { type: String },
    email: { type: String },
    phone: { type: String },
    address: { type: String },
    discountCode: { type: String },
    instructions: { type: String },
    cartList: [
      {
        _id: { type: String, required: true },
        title: { type: String, required: true },
        version: { type: String, required: true },
        variantId: { type: String, required: true },
        price: { type: Number, required: true },
        dimensions: { type: String, required: true },
        image: { type: String, required: true },
        quantity: { type: Number, default: 1 },
      },
    ],
    subtotal: Number,
    tax: Number,
    totalAmount: Number,
    status: {
      type: String,
      enum: [
        "pending",
        "paid",
        "fulfilled",
        "shipped",
        "cancelled",
        "refunded",
      ],
      default: "pending",
    },
    stripeSessionId: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
