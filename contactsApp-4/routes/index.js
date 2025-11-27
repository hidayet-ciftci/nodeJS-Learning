const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/index.html"));
});

router.post("/go-contacts", (req, res) => {
  console.log("Contact added");
  res.redirect("/contacts");
});

module.exports = router;
