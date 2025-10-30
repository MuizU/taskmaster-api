

import express from "express";
import todosRouter from "./routes/todos.js";
import usersRouter from "./routes/users.js";
import "dotenv/config";
import * as realTodoService from "./services/todos.service.js";
import * as realUserService from "./services/users.service.js";
import { swaggerUi, swaggerSpec } from "./swagger.js";
import rateLimit from "express-rate-limit";
import compression from "compression";
import helmet from "helmet";

export default function createApp({ todosService = realTodoService } = {}) {
  const app = express();


  // Security and performance middleware
  app.use(helmet());
  app.use(compression());
  app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
  }));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));



  // Swagger docs route
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.get("/", (_req, res) => {
    res.send("HELLO WORLD");
  });

  app.get("/hc", (_req, res) => {
    res.status(200).send("OK");
  });

  app.use("/todos", todosRouter(todosService));
  app.use("/users", usersRouter(realUserService));

  app.use((error, _req, res, _next) => {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  });

  app.use((_req, res) => {
    res.status(404).json({ error: "Not Found" });
  });

  return app;
}
