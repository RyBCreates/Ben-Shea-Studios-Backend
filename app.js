const dotenv = require("dotenv");
dotenv.config({
  path: process.env.NODE_ENV === "development" ? ".env.local" : ".env",
});

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const mainRouter = require("./routes");
const webhookRouter = require("./routes/webhook");

const app = express();
const PORT = process.env.PORT || 4001;

// 1️⃣ Stripe webhook route must use raw body parser
app.use(
  "/webhook/stripe",
  express.raw({ type: "application/json" }),
  webhookRouter
);

// 2️⃣ All other routes use JSON parser
app.use(express.json());

// CORS setup
const allowedOrigins =
  process.env.NODE_ENV === "development"
    ? ["http://localhost:5173"]
    : [
        "https://bensheastudio.com",
        "https://www.bensheastudio.com",
        "https://ben-shea-studios.vercel.app",
      ];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
  })
);

// Main routes
app.use("/", mainRouter);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(
    "Stripe key mode:",
    process.env.STRIPE_SECRET_KEY.startsWith("sk_test") ? "TEST" : "LIVE"
  );
});

module.exports = app;
