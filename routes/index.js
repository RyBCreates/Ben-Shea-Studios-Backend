const router = require("express").Router();

const artItemRouter = require("./artItems");
const stripeRouter = require("./stripe");
const orderRouter = require("./orders");
const cloudinaryRouter = require("./cloudinary");
const discountRouter = require("./discount");

router.use("/items", artItemRouter);
router.use("/stripe", stripeRouter);
router.use("/orders", orderRouter);
router.use("/uploads", cloudinaryRouter);
router.use("/discount", discountRouter);

module.exports = router;
