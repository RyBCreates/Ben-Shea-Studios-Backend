const router = require("express").Router();

const { createCheckout } = require("../controllers/stripe");

router.post("/create-checkout-session", createCheckout);

module.exports = router;
