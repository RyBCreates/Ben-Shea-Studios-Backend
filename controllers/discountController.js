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

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465, // SSL port
      secure: true, // use SSL
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      logger: true,
      debug: true,
    });

    transporter.verify((error, success) => {
      if (error) console.error("SMTP verify error:", error);
      else console.log("Server is ready to take messages");
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

module.exports = {
  signupForDiscount,
  getAllDiscountEmails,
};
