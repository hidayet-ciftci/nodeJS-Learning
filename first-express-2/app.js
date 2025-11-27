const http = require("http");

const express = require("express");

const app = express();

app.use((req, res, next) => {
  console.log("first middleware");
  next(); // Allows us to go the next middleware
});

app.use("/second-Page", (req, res, next) => {
  console.log("second page");
  res.send("<h1>Hello from Second Page</h1>"); //this is runs on the only
  //  "/second-page url"
});

app.get("/", (req, res, next) => {
  console.log("second middleware");
  res.send("<h1>Hello from express</h1>");
  next(); // Allows us to go the next middleware
});

app.get("/deneme1", (req, res, next) => {
  console.log("deneme1'den selam");
  res.send("<h1>deneme1</h1>");
});
app.post("/deneme2", (req, res, next) => {
  console.log("deneme2'den selam");
  res.send("<h1>deneme2</h1>");
});

/* app.use("/", (req, res, next) => {
  console.log("this is runs always");
  next();
}); */

app.listen(3000);

/* 
const server = http.createServer(app);

server.listen(3000); */
