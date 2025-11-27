const express = require("express");
const app = express();
const indexRouter = require("./routes/index");
const homeRouter = require("./routes/home");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(indexRouter);
app.use(homeRouter);
app.listen(3000);
