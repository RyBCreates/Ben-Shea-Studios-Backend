const Discount = require("../models/discount.js");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// Signup for email list and get discount
const signupForDiscount = async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email required" });
    }

    const existing = await Discount.findOne({ email });

    if (existing) {
      return res
        .status(409)
        .json({ error: "This email has already received a code." });
    }

    const discountCode = crypto.randomBytes(3).toString("hex").toUpperCase();

    await Discount.create({
      firstName,
      lastName,
      email,
      discountCode,
    });

    // Setup transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    // Verify SMTP connection
    await transporter.verify();
    console.log("SMTP ready");

    let emailSent = false;

    try {
      await transporter.sendMail({
        from: `"Ben Shea Studios" <${process.env.MAIL_USER}>`,
        to: email,
        subject: "Your 25% Discount Code",
        text: `Thanks for signing up! Your 25% discount code is: ${discountCode}`,
      });
      emailSent = true;
      console.log(`Discount email sent to ${email}`);
    } catch (mailErr) {
      console.error("Failed to send discount email:", mailErr);
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

// Get the list of emails from the admin side
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

// Validate a discount code
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

    // If found, return success + discount info
    return res.json({
      valid: true,
      discount: 25, // or whatever your % is
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
