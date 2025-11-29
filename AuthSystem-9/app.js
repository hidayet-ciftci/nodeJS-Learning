require("dotenv").config();

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// connection of the mongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("connected"))
  .catch((error) => console.log("error: ", error));

//Rotues and middlewares
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const errorHandler = require("./middleware/errorHandler");
const logger = require("./middleware/logger");

app.use(logger);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use(errorHandler);

app.listen(process.env.PORT);
