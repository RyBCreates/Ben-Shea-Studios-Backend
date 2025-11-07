const router = require("express").Router();

const artItemRouter = require("./artItems");
const stripeRouter = require("./stripe");
const orderRouter = require("./orders");
const cloudinaryRouter = require("./cloudinary");

router.use("/items", artItemRouter);
router.use("/stripe", stripeRouter);
router.use("/orders", orderRouter);
router.use("/uploads", cloudinaryRouter);

module.exports = router;
