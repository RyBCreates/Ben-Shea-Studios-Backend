const router = require("express").Router();

const artItemRouter = require("./artItems");
const stripeRouter = require("./stripe");
const orderRouter = require("./orders");

router.use("/items", artItemRouter);
router.use("/stripe", stripeRouter);
router.use("/orders", orderRouter);

module.exports = router;
