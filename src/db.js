import "dotenv/config";
import { Pool } from "pg";

const required = [
  "DB_USER",
  "DB_PASSWORD",
  "DB_HOST",
  "DB_PORT",
  "DB_DATABASE",
];
for (const k of required) {
  if (!process.env[k]) throw new Error(`Missing env var: ${k}`);
}

export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});
