const mongoose = require("mongoose");
const ArtItem = require("../models/artItem");

const getArtItems = (req, res) => {
  ArtItem.find({})
    .then((artItems) => res.send(artItems))
    .catch((err) => console.error(err));
};

module.exports = { getArtItems };
