import express from "express";
import { validate } from "../middlewares/validate.js";
import { createSchema, updateSchema } from "../validators/todo.schema.js";
import { pool } from "../db.js";

export default function createTodosRouter(todoService) {
  const router = express.Router();

  router
    .route("/")
    .get(async (_req, res, next) => {
      try {
        const rows = await todoService.listTodos();
        res.json(rows);
      } catch (error) {
        next(error);
      }
    })
    .post(validate(createSchema), async (req, res, next) => {
      try {
        const todo = await todoService.createTodo(req.body);
        res.setHeader("Location", `/todos/${todo.id}`);
        res.status(201).json({ todo });
      } catch (error) {
        next(error);
      }
    });

  router
    .route("/:id")
    .get(async (req, res, next) => {
      const id = parseInt(req.params.id);
      try {
        const todo = await todoService.getTodoById(id);
        if (!todo) return res.status(404).json({ error: "Not Found" });
        res.json({ todo: todo });
      } catch (error) {
        next(error);
      }
    })
    .put(validate(updateSchema), async (req, res, next) => {
      const id = parseInt(req.params.id);
      try {
        const todo = todoService.updateTodo(id, req.body);
        if (!todo) return res.status(404).json({ error: "Not Founds" });
        res.json({ updated: true, todo: todo });
      } catch (error) {
        next(error);
      }
    })
    .delete(async (req, res, next) => {
      const id = parseInt(req.params.id);
      try {
        const rowCount = await todoService.deleteTodo(id);
        if (!rowCount) return res.status(404).json({ error: "Not Found" });
        return res.status(204).end();
      } catch (error) {
        next(error);
      }
    });
  return router;
}
