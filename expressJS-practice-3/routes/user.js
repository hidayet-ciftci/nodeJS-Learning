const express = require("express");
const router = express.Router();

router.get("/userPage", (req, res, next) => {
  console.log(req.query);
  res.json({
    recieved: req.query,
    message: "hello from user page",
    status: "success",
  });
});

router.post("/userPage", (req, res, next) => {
  console.log(req.body);
  res.json({ message: "data received", data: req.body });
});

module.exports = router;
