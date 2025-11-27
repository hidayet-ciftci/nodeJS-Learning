const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const checkRole = require("../middleware/checkRole");
const User = require("../models/User");

router.get("/profile", verifyToken, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ message: "profile accesed", user });
  } catch (error) {
    next(error);
  }
});

router.get("/", verifyToken, checkRole("admin"), async (req, res, next) => {
  try {
    // Tüm kullanıcıları bul ama şifrelerini getirme
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
