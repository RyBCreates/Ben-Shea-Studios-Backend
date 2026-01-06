const router = require("express").Router();

const artItemRouter = require("./artItems");
const exhibitRouter = require("./exhibits");
const stripeRouter = require("./stripe");
const orderRouter = require("./orders");
const cloudinaryRouter = require("./cloudinary");
const discountRouter = require("./discount");

router.use("/items", artItemRouter);
router.use("/exhibits", exhibitRouter);
router.use("/stripe", stripeRouter);
router.use("/orders", orderRouter);
router.use("/uploads", cloudinaryRouter);
router.use("/discount", discountRouter);

module.exports = router;
