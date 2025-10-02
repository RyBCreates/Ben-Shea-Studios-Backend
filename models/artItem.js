const mongoose = require("mongoose");

const artItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("artItem", artItemSchema);
