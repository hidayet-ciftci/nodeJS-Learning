const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();
const User = require("../models/User");

router.get("/profile", verifyToken, async (req, res, next) => {
  // async kodu çalışmadan önce verifyToken middleware'den geç
  try {
    const user = await User.findById(req.user.id).select("-password"); // güvenlik amaçlı şifresiz gönderiyoruz
    res.json({ message: "Profile accessed", user });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
