const mongoose = require("mongoose");

const DiscountSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    discountCode: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Discount", DiscountSchema);
