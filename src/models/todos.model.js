import { pool } from "../db.js";

export async function listTodosModel(userId = null) {
  if (userId) {
    const { rows } = await pool.query(
      "SELECT * FROM todos WHERE user_id = $1 ORDER BY id ASC",
      [userId]
    );
    return rows;
  }

  const { rows } = await pool.query("SELECT * FROM todos ORDER BY id ASC");
  return rows;
}

export async function createTodoModel({ title, completed = false, user_id = null }) {
  const { rows } = await pool.query(
    "INSERT INTO todos (title, completed, user_id) VALUES ($1, $2, $3) RETURNING *",
    [title, completed, user_id]
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
