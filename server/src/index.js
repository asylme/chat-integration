import cors from "cors";
import express from "express";
import { env, validateEnvOnStartup } from "./config/env.js";
import chatRoutes from "./routes/chat.routes.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

validateEnvOnStartup();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/api", chatRoutes);
app.use(errorMiddleware);

app.listen(env.port, () => {
  console.log(`Server running on port ${env.port}`);
});
