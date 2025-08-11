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
  .get((_req, res) => {
    pool.query("SELECT * FROM todos ORDER BY id ASC", (error, results) => {
      if (error) {
        return res.status(400).json({ error });
      }

      return res.status(200).json(results.rows);
    });
  })
  .post((req, res) => {
    const { title, completed } = req.body;

    pool.query(
      `INSERT INTO todos (title, completed) VALUES($1, $2) RETURNING *`,
      [title, completed],
      (error, results) => {
        if (error) {
          return res.status(400).json({ error });
        }

        return res
          .status(201)
          .send(`User added with ID: ${results.rows[0].id}`);
      }
    );
  });

router
  .route("/:id")
  .put((req, res) => {
    const id = parseInt(req.params.id);
    const { title, completed } = req.body;
    pool.query(
      "UPDATE todos SET title = $1, completed = $2 WHERE id = $3",
      [title, completed, id],
      (error, _results) => {
        if (error) {
          return res.status(400).json({ error });
        }
        return res.status(200).send(`User modified with ID: ${id}`);
      }
    );
  })
  .delete((req, res) => {
    const id = parseInt(req.params.id);
    pool.query("DELETE FROM todos WHERE id = $1", [id], (error, _results) => {
      if (error) {
        return res.status(400);
      }
      return res.status(200).send(`User deleted with ID: ${id}`);
    });
  });

export default router;
