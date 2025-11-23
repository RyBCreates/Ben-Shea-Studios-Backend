const Discount = require("../models/discount.js");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// POST /discount/signup
const signupForDiscount = async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email required" });
    }

    // Check for existing email
    const existing = await Discount.findOne({ email });

    if (existing) {
      return res
        .status(409)
        .json({ error: "This email has already received a code." });
    }

    // Generate discount code
    const discountCode = crypto.randomBytes(3).toString("hex").toUpperCase();

    // Save entry
    await Discount.create({
      firstName,
      lastName,
      email,
      discountCode,
    });

    // Send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Ben Shea Studios" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Your 25% Discount Code",
      text: `Thanks for signing up! Your 25% discount code is: ${discountCode}`,
    });

    return res.json({ message: "Discount email sent!" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// GET /discount/emails (ADMIN ONLY)
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

module.exports = {
  signupForDiscount,
  getAllDiscountEmails,
};
