const mongoose = require("mongoose");

const exhibitSchema = new mongoose.Schema(
  {
    location: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    address: {
      type: String,
    },
    image: {
      type: String,
      required: true,
      validate: {
        validator: (url) => /^https?:\/\/.+/.test(url),
        message: "Invalid image URL",
      },
    },
    artItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ArtItem",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Exhibit", exhibitSchema);
