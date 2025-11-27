const express = require("express");
const router = express.Router();
const todos = [
  { id: 0, title: "todo1" },
  { id: 1, title: "todo2" },
  { id: 2, title: "todo3" },
];

router.get("/Users-product", (req, res, next) => {
  /*  console.log("hello from users"); */
  res.send(
    '<form action="/product" method="POST"><input type="text" name="title"><button type="submit">add Product</button></input></Form>'
  );
});

router.post("/product", (req, res, next) => {
  console.log(req.body);

  res.redirect("/");
});

module.exports = router;
