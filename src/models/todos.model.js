import { pool } from "../db.js";

export async function listTodosModel() {
  const { rows } = await pool.query("SELECT * FROM todos ORDER BY id ASC");
  return rows;
}

export async function createTodoModel({ title, completed = false }) {
  const { rows } = await pool.query(
    "INSERT INTO todos (title, completed) VALUES ($1, $2) RETURNING *",
    [title, completed]
  );

  return rows[0];
}

export async function getTodoByIdModel(id) {
  const { rows } = await pool.query("SELECT * FROM todos WHERE id = $1", [id]);
  return rows[0] ?? null;
}

export async function updateTodoModel(id, { title, completed }) {
  const { rows } = await pool.query(
    "UPDATE todos SET title = $1, completed = $2 WHERE id = $3 RETURNING *",
    [title, completed, id]
  );

  return rows[0] ?? null;
}

export async function deleteTodoModel(id) {
  const { rowCount } = await pool.query("DELETE FROM todos WHERE id = $1", [
    id,
  ]);

  return rowCount > 0;
}
