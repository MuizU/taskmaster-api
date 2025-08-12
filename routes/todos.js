import { Pool } from "pg";
import express from "express";

const router = express.Router();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

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
  .post(async (req, res) => {
    const { title, completed } = req.body;
    try {
      const { rows } = await pool.query(
        `INSERT INTO todos (title, completed) VALUES($1, $2) RETURNING *`,
        [title, completed]
      );
      res.json({ rows });
    } catch (error) {
      next(error);
    }
  });

router
  .route("/:id")
  .put(async (req, res) => {
    const id = parseInt(req.params.id);
    const { title, completed } = req.body;
    try {
      const { rows } = await pool.query(
        "UPDATE todos SET title = $1, completed = $2 WHERE id = $3",
        [title, completed, id]
      );
      res.json({ updated: true, todos });
    } catch (error) {
      next(error);
    }
  })
  .delete(async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      await pool.query("DELETE FROM todos WHERE id = $1", [id]);
      res.status(204);
    } catch (error) {
      next(error);
    }
  });

export default router;
