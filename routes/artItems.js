const router = require("express").Router();

const { getArtItems } = require("../controllers/artItemsController");

router.get("/", getArtItems);

module.exports = router;
