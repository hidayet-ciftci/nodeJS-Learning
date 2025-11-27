require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(
    "mongodb+srv://hidayetcft_db_user:lG1YUAvEr9WoJUk8@cluster0.vzsnmvu.mongodb.net/"
  )
  .then(() => console.log("connected"))
  .catch((err) => console.log("error: ", err));

//Routes and middlewares
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const errorHandler = require("./middleware/errorHandler");
const logger = require("./middleware/logger");

app.use(logger);
app.use("/api", authRouter);
app.use(profileRouter);
app.use(errorHandler);

app.listen(3000);
