const Exhibit = require("../models/exhibit");

// GET all exhibits
const getExhibits = async (req, res) => {
  try {
    const exhibits = await Exhibit.find().populate("artItems");
    res.json(exhibits);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch exhibits" });
  }
};

// GET single exhibit by ID
const getExhibitById = async (req, res) => {
  try {
    const exhibit = await Exhibit.findById(req.params.id).populate("artItems");
    if (!exhibit) return res.status(404).json({ error: "Exhibit not found" });
    res.json(exhibit);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch exhibit" });
  }
};

// CREATE new exhibit
const createExhibit = async (req, res) => {
  try {
    const { location, description, address, image, artItems } = req.body;
    const newExhibit = new Exhibit({
      location,
      description,
      address,
      image,
      artItems,
    });
    await newExhibit.save();
    res.status(201).json(newExhibit);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Failed to create exhibit" });
  }
};

// UPDATE exhibit
const updateExhibit = async (req, res) => {
  try {
    const updatedExhibit = await Exhibit.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedExhibit)
      return res.status(404).json({ error: "Exhibit not found" });
    res.json(updatedExhibit);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Failed to update exhibit" });
  }
};

// DELETE exhibit
const deleteExhibit = async (req, res) => {
  try {
    const deletedExhibit = await Exhibit.findByIdAndDelete(req.params.id);
    if (!deletedExhibit)
      return res.status(404).json({ error: "Exhibit not found" });
    res.json({ message: "Exhibit deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete exhibit" });
  }
};

module.exports = {
  getExhibits,
  getExhibitById,
  createExhibit,
  updateExhibit,
  deleteExhibit,
};
