const router = require("express").Router();

const artItemRouter = require("./artItems");

router.use("/items", artItemRouter);

module.exports = router;
