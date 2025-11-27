const express = require("express");
const app = express();
const homeRoute = require("./routes/home");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(homeRoute);

app.listen(3000);
