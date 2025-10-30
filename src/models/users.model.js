import { pool } from "../db.js";

export async function listUsersModel() {
  const { rows } = await pool.query("SELECT * FROM users ORDER BY id ASC");
  return rows;
}

export async function createUserModel({ username, email }) {
  const { rows } = await pool.query(
    "INSERT INTO users (username, email) VALUES ($1, $2) RETURNING *",
    [username, email]
  );

  return rows[0];
}

export async function getUserByIdModel(id) {
  const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return rows[0] ?? null;
}

export async function updateUserModel(id, { username, email }) {
  const { rows } = await pool.query(
    "UPDATE users SET username = $1, email = $2 WHERE id = $3 RETURNING *",
    [username, email, id]
  );

  return rows[0] ?? null;
}

export async function deleteUserModel(id) {
  const { rowCount } = await pool.query("DELETE FROM users WHERE id = $1", [
    id,
  ]);

  return rowCount > 0;
}
