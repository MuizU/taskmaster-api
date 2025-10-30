import express from "express";
import { validate } from "../middlewares/validate.js";
import { createSchema, updateSchema } from "../validators/todo.schema.js";

export default function createTodosRouter(todoService) {
  const router = express.Router();

  router
    .route("/")
    .get(async (_req, res, next) => {
      try {
        // support optional filtering by owner via query or header
        const userId =
          (_req.query && _req.query.userId && parseInt(_req.query.userId)) ||
          (_req.headers && _req.headers["x-user-id"] && parseInt(_req.headers["x-user-id"])) ||
          null;
        const rows = await todoService.listTodos(userId);
        res.json(rows);
      } catch (error) {
        next(error);
      }
    })
    .post(validate(createSchema), async (req, res, next) => {
      try {
        // determine owner: prefer X-User-Id header, fallback to body.user_id
        const ownerFromHeader = req.headers && req.headers["x-user-id"] ? parseInt(req.headers["x-user-id"]) : null;
        const payload = {
          ...req.body,
          user_id: ownerFromHeader || req.body.user_id || null,
        };

        const todo = await todoService.createTodo(payload);
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

        // enforce ownership if X-User-Id header provided
        const ownerHeader = req.headers && req.headers["x-user-id"] ? parseInt(req.headers["x-user-id"]) : null;
        if (ownerHeader && todo.user_id !== ownerHeader) return res.status(403).json({ error: "Forbidden" });

        res.json({ todo: todo });
      } catch (error) {
        next(error);
      }
    })
    .put(validate(updateSchema), async (req, res, next) => {
      const id = parseInt(req.params.id);
      try {
        // ensure ownership: check existing todo
        const existing = await todoService.getTodoById(id);
        if (!existing) return res.status(404).json({ error: "Not Found" });
        const ownerHeader = req.headers && req.headers["x-user-id"] ? parseInt(req.headers["x-user-id"]) : null;
        const ownerInBody = req.body && req.body.user_id ? parseInt(req.body.user_id) : null;
        const reqOwner = ownerHeader || ownerInBody;
        if (reqOwner && existing.user_id !== reqOwner) return res.status(403).json({ error: "Forbidden" });

        const todo = await todoService.updateTodo(id, req.body);
        if (!todo) return res.status(404).json({ error: "Not Found" });
        res.json({ updated: true, todo: todo });
      } catch (error) {
        next(error);
      }
    })
    .delete(async (req, res, next) => {
      const id = parseInt(req.params.id);
      try {
        // enforce ownership on delete
        const existing = await todoService.getTodoById(id);
        if (!existing) return res.status(404).json({ error: "Not Found" });
        const ownerHeader = req.headers && req.headers["x-user-id"] ? parseInt(req.headers["x-user-id"]) : null;
        if (ownerHeader && existing.user_id !== ownerHeader) return res.status(403).json({ error: "Forbidden" });

        const rowCount = await todoService.deleteTodo(id);
        if (!rowCount) return res.status(404).json({ error: "Not Found" });
        return res.status(204).end();
      } catch (error) {
        next(error);
      }
    });
  return router;
}
