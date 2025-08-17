import express from "express";
import todosRouter from "./routes/todos.js";
import "dotenv/config";
import * as realTodoService from "./services/todos.service.js";

export default function createApp({ todosService = realTodoService } = {}) {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get("/", (_req, res) => {
    res.send("HELLO WORLD");
  });

  app.get("/hc", (_req, res) => {
    res.status(200).send("OK");
  });

  app.use("/todos", todosRouter(todosService));

  app.use((error, _req, res, _next) => {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  });

  app.use((_req, res) => {
    res.status(404).json({ error: "Not Found" });
  });

  return app;
}
