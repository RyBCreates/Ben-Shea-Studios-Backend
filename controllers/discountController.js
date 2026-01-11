const Discount = require("../models/discount");
const crypto = require("crypto");

// SIGNUP
const signupForDiscount = async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email required" });
    }

    const existing = await Discount.findOne({ email });
    if (existing) {
      return res.status(409).json({
        error: "This email has already received a code.",
      });
    }

    const discountCode = crypto.randomBytes(3).toString("hex").toUpperCase();

    await Discount.create({
      firstName,
      lastName,
      email,
      discountCode,
    });

    // Backend ONLY returns data
    return res.json({
      message: "Discount created",
      email,
      firstName,
      discountCode,
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ADMIN – FETCH ALL EMAILS
const getAllDiscountEmails = async (req, res) => {
  try {
    const key = req.headers["x-admin-key"];
    if (key !== process.env.ADMIN_KEY) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const all = await Discount.find().sort({ createdAt: -1 });
    return res.json(all);
  } catch (err) {
    console.error("Email fetch error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// VALIDATE DISCOUNT CODE
const validateDiscountCode = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: "Discount code required" });
    }

    const discount = await Discount.findOne({
      discountCode: code.toUpperCase(),
    });

    if (!discount) {
      return res.status(404).json({ error: "Invalid discount code" });
    }

    return res.json({
      valid: true,
      discount: 25,
      message: "Discount code applied!",
    });
  } catch (err) {
    console.error("Discount validation error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  signupForDiscount,
  getAllDiscountEmails,
  validateDiscountCode,
};
