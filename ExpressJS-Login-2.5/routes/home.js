const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  console.log("hello from Home Page");
  res.send("<h1>Hello From Home Page</h1>");
});

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;
  console.log(req.body);
  res.json({ message: "login data received", data: req.body });
});

module.exports = router;
