const ArtItem = require("../models/artItem");

// GET all art items
const getArtItems = (req, res) => {
  ArtItem.find({})
    .then((artItems) => res.json(artItems))
    .catch((err) => res.status(500).json({ error: err.message }));
};

// GET art item by ID
const getArtItemById = (req, res) => {
  const { id } = req.params;
  ArtItem.findById(id)
    .then((artItem) => {
      if (!artItem) {
        return res.status(404).json({ error: "Art item not found" });
      }
      res.json(artItem);
    })
    .catch((err) => res.status(500).json({ error: err.message }));
};

// CREATE new art item
const createArtItem = (req, res) => {
  const artItemData = req.body;

  ArtItem.create(artItemData)
    .then((newArtItem) => res.status(201).json(newArtItem))
    .catch((err) => res.status(400).json({ error: err.message }));
};

// UPDATE art item
const updateArtItem = (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  ArtItem.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  })
    .then((updatedArtItem) => {
      if (!updatedArtItem) {
        return res.status(404).json({ error: "Art item not found" });
      }
      res.json(updatedArtItem);
    })
    .catch((err) => res.status(400).json({ error: err.message }));
};

// Mark original as sold
const markOriginalSold = (req, res) => {
  const { id } = req.params;

  ArtItem.findByIdAndUpdate(id, { "original.sold": true }, { new: true })
    .then((updatedArtItem) => {
      if (!updatedArtItem) {
        return res.status(404).json({ error: "Art item not found" });
      }
      res.json(updatedArtItem);
    })
    .catch((err) => res.status(400).json({ error: err.message }));
};

// DELETE art item
const deleteArtItem = (req, res) => {
  const { id } = req.params;

  ArtItem.findByIdAndDelete(id)
    .then((deletedArtItem) => {
      if (!deletedArtItem) {
        return res.status(404).json({ error: "Art item not found" });
      }
      res.json({ message: "Art item deleted successfully", deletedArtItem });
    })
    .catch((err) => res.status(500).json({ error: err.message }));
};

module.exports = {
  getArtItems,
  getArtItemById,
  createArtItem,
  updateArtItem,
  markOriginalSold,
  deleteArtItem,
};
