const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  role: {
    type: String,
    enum: ["user", "admin"], // Sadece bu değerleri alabilir
    default: "user", // Kayıt olan herkes varsayılan olarak 'user' olur
  },
  profileImage: { type: String, default: "" },
  cvFile: { type: String, default: "" },
});

module.exports = mongoose.model("UserFile", userSchema);
