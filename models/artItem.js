const mongoose = require("mongoose");

const printOptionSchema = new mongoose.Schema(
  {
    size: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false }
);

const artItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    categories: {
      type: [String],
      required: true,
      validate: {
        validator: (arr) =>
          arr.length > 0 &&
          arr.every((cat) =>
            [
              "landscape",
              "abstract",
              "people",
              "pets",
              "sketch",
              "photo",
              "print",
            ].includes(cat)
          ),
        message: "Invalid category",
      },
    },

    images: {
      type: [String],
      required: true,
      validate: [
        {
          validator: (arr) => arr.length > 0,
          message: "At least one image is required",
        },
      ],
    },

    original: {
      price: {
        type: Number,
        required: true,
      },
      dimensions: {
        type: String,
        required: true,
      },
      sold: {
        type: Boolean,
        default: false,
      },
    },

    prints: {
      type: [printOptionSchema],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ArtItem", artItemSchema);
