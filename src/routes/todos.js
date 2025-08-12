import express from "express";
import { validate } from "../middlewares/validate";
import { createSchema, updateSchema } from "../validators/todo.schema";
import { pool } from "../db.js";

const router = express.Router();

router
  .route("/")
  .get(async (_req, res, next) => {
    try {
      const { rows } = await pool.query("SELECT * FROM todos ORDER BY id ASC");
      res.json(rows);
    } catch (error) {
      next(error);
    }
  })
  .post(validate(createSchema), async (req, res, next) => {
    const { title, completed } = req.body;
    try {
      const { rows } = await pool.query(
        `INSERT INTO todos (title, completed) VALUES($1, $2) RETURNING *`,
        [title, completed]
      );
      const todo = rows[0];
      res.setHeader("Location", `/todos/${todo.ids}`);
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
      const { rows } = await pool.query("SELECT * FROM todos WHERE id = $1", [
        id,
      ]);
      if (!rows.length) return res.status(404).json({ error: "Not Found" });
      res.json({ todo: rows[0] });
    } catch (error) {
      next(error);
    }
  })
  .put(validate(updateSchema), async (req, res, next) => {
    const id = parseInt(req.params.id);
    const { title, completed } = req.body;
    try {
      const { rows } = await pool.query(
        "UPDATE todos SET title = $1, completed = $2 WHERE id = $3",
        [title, completed, id]
      );
      if (!rows.length) return res.status(404).json({ error: "Not Founds" });
      res.json({ updated: true, todo: rows[0] });
    } catch (error) {
      next(error);
    }
  })
  .delete(async (req, res, next) => {
    const id = parseInt(req.params.id);
    try {
      const { rowCount } = await pool.query("DELETE FROM todos WHERE id = $1", [
        id,
      ]);
      if (!rowCount) return res.status(404).json({ error: "Not Found" });
      return res.status(204).end();
    } catch (error) {
      next(error);
    }
  });

export default router;
