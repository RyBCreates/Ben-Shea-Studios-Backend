const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    fullName: { type: String },
    email: { type: String },
    phone: { type: String },
    address: { type: String },
    cartList: [
      {
        title: String,
        price: Number,
        quantity: Number,
        image: String,
      },
    ],
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
