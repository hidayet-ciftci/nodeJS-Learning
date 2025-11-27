const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const contactRouter = require("./routes/contact");
const homeRouter = require("./routes/index");

app.use(homeRouter);
app.use(contactRouter);

app.listen(3000);
