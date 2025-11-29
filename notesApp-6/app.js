const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB bağlantısı
mongoose
  .connect("")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandle");
const notesRouter = require("./routes/notes");

app.use(logger); // logger üstte olmalı ki önce logger çalışsın
app.use("/api", notesRouter); // sonra route'lar
app.use(errorHandler); // en sona ise error handling

//  1️⃣ Genel middleware’ler (logger, cors, body-parser vs.)
//  2️⃣ Yetkilendirme veya kontrol middleware’leri
//  3️⃣ Router’lar (uygulamanın endpoint’leri)
//  4️⃣ Hata yakalama middleware’i (en sonda)  -> logger → auth → route → error handler

app.listen(3000);
