const express = require("express");
const router = express.Router();

const todos = [
  { id: 0, title: "todo1" },
  { id: 1, title: "todo2" },
  { id: 2, title: "todo3" },
];
router.get("/todos", (req, res) => {
  res.json(todos);
});

router.post("/todos", (req, res) => {
  const newTodo = { id: Date.now(), ...req.body };
  const index = todos.findIndex((item) => item.id === newTodo.id);
  if (index !== -1)
    return res.status(400).json({ error: "Todo with this ID already exists" });
  todos.push(newTodo);
  console.log("todo eklendi");
  res.status(201).json(newTodo);
});

router.put("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex((item) => item.id === id);

  if (index === -1) return res.status(404).json({ error: "Todo not found" });

  todos[index] = { ...todos[index], ...req.body };
  console.log("todo güncellendi");
  res.json(todos[index]);
});

router.delete("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex((item) => item.id === id);

  if (index === -1) return res.status(404).json({ error: "Todo not found" });

  todos.splice(index, 1);
  console.log("todo silindi");
  res.status(204).end();
});
/* router.post("/add", (req, res) => {
  console.log("todo eklendi");
  todos.push(req.body);
  res.redirect("/home");
});

router.post("/put", (req, res) => {
  todos.findIndex((item) => {
    item.id == req.body.id ? (item.title = req.body.title) : null;
  });
  console.log("todo güncellendi");
  res.redirect("/home");
});
router.post("/delete", (req, res) => {
  todos.pop(req.body);
  console.log("todo silindi");
  res.redirect("/home");
}); */

module.exports = router;
