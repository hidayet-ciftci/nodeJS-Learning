const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const Jwt = require("jsonwebtoken");

//list users
router.get("/users", async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

// register user
router.post("/register", async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || "user",
    });
    res.status(201).json({ message: "user created", user });
  } catch (error) {
    next(error);
  }
});

//login User
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "user not found" });
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) return res.status(400).json({ message: "wrong password" });
    const accessToken = Jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );
    const refreshToken = Jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: "7d",
      }
    );
    user.refreshToken = refreshToken;
    await user.save();
    res.json({ message: "login success", accessToken, refreshToken });
  } catch (error) {
    next(error);
  }
});
//refresh token
router.post("/refresh", async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token)
      return res.status(401).json({ message: "Refresh token gerekli" });

    const user = await User.findOne({ refreshToken: token });
    if (!user)
      return res.status(403).json({ message: "Geçersiz refresh token (DB)" });

    Jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) return res.status(401).json({ message: "token is invalid" });
      const newAcessToken = Jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "15m",
      });
      res.json({ accessToken: newAcessToken });
    });
  } catch (error) {
    next(error);
  }
});
//logout, delete token
router.post("/logout", async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: "Token gerekli" });
    const user = await User.findOne({ refreshToken: token });
    if (user) {
      user.refreshToken = null;
      await user.save();
    }
    res.status(200).json({ message: "succesed logout" });
  } catch (error) {
    next(error);
  }
});
module.exports = router;
