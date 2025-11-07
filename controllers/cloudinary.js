const uploadImage = async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    res.json({
      success: true,
      imageUrl: req.file.path,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Server error during upload" });
  }
};

module.exports = {
  uploadImage,
};
