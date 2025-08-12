import express from "express";
import todosRouter from "./routes/todos";
import "dotenv/config";
import cors from "cors";

const app = express();

// const allowedOrigins = ["http://localhost:3000"];

// const corsOptions = {
//   origin: (origin, callback) => {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
//   allowedHeaders: ["Content-Type", "Authorization"],
// };
// app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  res.send("HELLO WORLD");
});

app.use("/todos", todosRouter);

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: "Internal Server Error" });
});

app.use((_req, res) => {
  res.status(404).json({ error: "Not Found" });
});

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
