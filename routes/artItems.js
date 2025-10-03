const router = require("express").Router();

const {
  getArtItems,
  getArtItemById,
  createArtItem,
  updateArtItem,
  markOriginalSold,
  deleteArtItem,
} = require("../controllers/artItemsController");

router.get("/", getArtItems);
router.get("/:id", getArtItemById);
router.post("/", createArtItem);
router.patch("/:id", updateArtItem);
router.patch("/:id/sell-original", markOriginalSold);
router.delete("/:id", deleteArtItem);

module.exports = router;
