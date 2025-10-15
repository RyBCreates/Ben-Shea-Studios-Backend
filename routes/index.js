const router = require("express").Router();

const artItemRouter = require("./artItems");
const stripeRouter = require("./stripe");

router.use("/items", artItemRouter);
router.use("/stripe", stripeRouter);

module.exports = router;
