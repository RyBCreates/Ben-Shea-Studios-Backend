const express = require("express");
const { uploadImage } = require("../controllers/cloudinary");
const upload = require("../middlewares/cloudinary");

const router = express.Router();

router.post("/upload", upload.single("image"), uploadImage);

module.exports = router;
