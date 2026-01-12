const uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const imageUrls = req.files.map((file) => file.path);

    res.json({
      success: true,
      imageUrls,
    });
  } catch (error) {
    console.error("Error uploading images:", error);
    res.status(500).json({ error: "Server error during upload" });
  }
};

module.exports = {
  uploadImages,
};
