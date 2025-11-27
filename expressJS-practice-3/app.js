const express = require("express");
const app = express();
/* const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false })); */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const adminRoutes = require("./routes/admin");
const homeRoute = require("./routes/home");
const userRoute = require("./routes/user");

// bununla da bodyparser ın yaptığı işi yapabiliriz.

app.use(homeRoute);
app.use(adminRoutes);
app.use(userRoute);
app.listen(3000);
