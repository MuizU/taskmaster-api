import express from "express";

const router = express.Router();

const todos = [];

router
  .route("/")
  .get((_req, res) => {
    return res.json(todos);
  })
  .post((req, res) => {
    const todo = {
      id: todos.length + 1,
      title: req.body.title,
      completed: req.body.completed || false,
    };

    todos.push(todo);

    res.status(201).json(todo);
  });

router
  .route("/:id")
  .put((req, res) => {
    const id = parseInt(req.params.id);
    const todo = todos.find((t) => t.id === id);
    if (!todo) {
      return res.status(404).json({ error: "Error: todo not found!" });
    }

    todo.title = req.body.title || todo.title;
    todo.completed = req.body.completed || todo.completed;

    res.json(todo);
  })
  .delete((req, res) => {
    const id = parseInt(req.params.id);
    const index = todos.findIndex((t) => t.id === id);
    if (index < 0) {
      return res.status(404).json({ error: "Error: id not found!" });
    }

    todos.splice(index, 1);
    res.status(204).send();
  });

export default router;
