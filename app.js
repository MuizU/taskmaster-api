import express from "express";
import todosRouter from "./routes/todos.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  res.send("HELLO WORLD");
});

app.use("/todos", todosRouter);

const PORT = 9000;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
