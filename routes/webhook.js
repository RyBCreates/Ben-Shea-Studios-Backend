const express = require("express");
const router = express.Router();
const { handleStripeWebhook } = require("../controllers/webhook");

// Only handle POST at root since /webhook/stripe is already raw in app.js
router.post("/", handleStripeWebhook);

module.exports = router;
