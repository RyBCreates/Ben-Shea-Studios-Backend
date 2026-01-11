const Discount = require("../models/discount.js");
const crypto = require("crypto");
const emailjs = require("@emailjs/nodejs");

const signupForDiscount = async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;

    if (!email) return res.status(400).json({ error: "Email required" });

    const existing = await Discount.findOne({ email });
    if (existing)
      return res
        .status(409)
        .json({ error: "This email has already received a code." });

    // Generate a unique discount code
    const discountCode = crypto.randomBytes(3).toString("hex").toUpperCase();

    await Discount.create({
      firstName,
      lastName,
      email,
      discountCode,
    });

    // Prepare EmailJS parameters
    const templateParams = {
      firstName: firstName || "there",
      discountCode,
      email,
    };

    let emailSent = false;

    try {
      await emailjs.send(
        process.env.EMAILJS_SERVICE_ID,
        process.env.EMAILJS_TEMPLATE_ID,
        templateParams,
        {
          publicKey: process.env.EMAILJS_PUBLIC_KEY,
          privateKey: process.env.EMAILJS_PRIVATE_KEY,
        }
      );
      emailSent = true;
      console.log(`Discount email sent to ${email}`);
    } catch (err) {
      console.error("Failed to send discount email via EmailJS:", err);
    }

    // Respond regardless of email success
    return res.json({
      message: emailSent
        ? "Discount email sent!"
        : "Saved to database, but email could not be sent. Check server logs.",
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const getAllDiscountEmails = async (req, res) => {
  try {
    const key = req.headers["x-admin-key"];
    if (key !== process.env.ADMIN_KEY)
      return res.status(401).json({ error: "Unauthorized" });

    const all = await Discount.find().sort({ createdAt: -1 });
    return res.json(all);
  } catch (err) {
    console.error("Email fetch error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const validateDiscountCode = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: "Discount code required" });

    const discount = await Discount.findOne({
      discountCode: code.toUpperCase(),
    });
    if (!discount)
      return res.status(404).json({ error: "Invalid discount code" });

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
