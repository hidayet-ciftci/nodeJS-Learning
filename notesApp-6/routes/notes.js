const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Şema tanımı
const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: String,
  userId: { type: String, required: true },
});

const Note = mongoose.model("Note", noteSchema);

// const A = mongoose.model("Note", noteSchema);  // -> koleksiyon: notes
//const B = mongoose.model("Post", noteSchema);  // -> koleksiyon: posts
// const C = mongoose.model("Comment", noteSchema, "mycomments"); // -> koleksiyon: mycomments

// CREATE
router.post("/notes", async (req, res) => {
  try {
    const note = await Note.create(req.body);
    res.status(201).json(note);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ
router.get("/notes", async (req, res) => {
  const notes = await Note.find();
  res.json(notes);
});

router.get("/notes/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const notes = await Note.findById(id);
    if (!notes) return res.status(404).json({ error: "note not found" }); // best practice olarak next error kullan.
    res.json(notes);
  } catch (error) {
    next(error);
  }
});

// UPDATE
router.put("/notes/:id", async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!note) return res.status(404).json({ error: "Note not found" });
    res.json(note);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE
router.delete("/notes/:id", async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) return res.status(404).json({ error: "Note not found" });
    res.json({ message: "Note deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
