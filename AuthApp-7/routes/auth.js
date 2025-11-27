const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const Jwt = require("jsonwebtoken");

//
router.get("/users", async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

//register
router.post("/register", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // 10 karmaşıklık seviyesi
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    res.status(201).json({ message: "user Created", user });
  } catch (error) {
    next(error);
  }
});

//login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "not found user" });

    const isMatched = await bcrypt.compare(password, user.password);

    if (!isMatched) return res.status(401).json({ error: "invaled password" });

    const token = Jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      // Jwt.sign ile token üretiyoruz, içine gönderdiğimiz
      expiresIn: "1h", // obje , id ile bu token'ın kime ait olduğu , key ile imza
    }); // tüketilme tarihi belirleniyor
    res.json({ message: "login success", token });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
