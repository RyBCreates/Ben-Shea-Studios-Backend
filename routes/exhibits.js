const router = require("express").Router();
const {
  getExhibits,
  getExhibitById,
  createExhibit,
  updateExhibit,
  deleteExhibit,
} = require("../controllers/exhibitController");

router.get("/", getExhibits);
router.get("/:id", getExhibitById);
router.post("/", createExhibit);
router.patch("/:id", updateExhibit);
router.delete("/:id", deleteExhibit);

module.exports = router;
