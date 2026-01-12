const express = require("express");
const { uploadImages } = require("../controllers/cloudinary");
const upload = require("../middlewares/cloudinary");

const router = express.Router();

router.post("/upload", upload.array("images", 10), uploadImages);

module.exports = router;
