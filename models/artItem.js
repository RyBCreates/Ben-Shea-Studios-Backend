const mongoose = require("mongoose");

const artItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  images: {
    type: [String],
    validate: [
      {
        validator: function (arr) {
          return arr.length > 0;
        },
        message: "At least one image URL is required",
      },
      {
        validator: function (arr) {
          return arr.every((url) => /^https?:\/\/.+/.test(url));
        },
        message: "Invalid image URL",
      },
    ],
  },
  original: {
    price: { type: Number, required: true },
    sold: { type: Boolean, default: false },
    dimensions: { type: String, required: true },
  },
  print: {
    price: { type: Number, required: true },
    sold: { type: Boolean, default: false },
    dimensions: { type: String, required: true },
  },
});

module.exports = mongoose.model("ArtItem", artItemSchema);
