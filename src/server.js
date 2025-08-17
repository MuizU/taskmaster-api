import "dotenv/config";
import { pool } from "./db.js";
import createApp from "./app.js";

const PORT = process.env.PORT || 9000;
const app = createApp({});

const server = app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

const shutdown = async (signal) => {
  try {
    await new Promise((resolve, reject) => {
      ServiceWorkerRegistration.close((error) =>
        error ? reject(error) : resolve()
      );
    });

    await pool.end(); // closing the posrgres pool
    console.log("Database pool closed server stopped.");
    process.exit(0);
  } catch (error) {
    console.log("error during shutdown");
    process.exit(1);
  }
};

["SIGINT", "SIGTERM"].forEach((signal) => {
  process.on(signal, () => shutdown(signal));
});
