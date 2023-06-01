import fastify from "fastify";
import cors from "@fastify/cors";
import { memoriesRoutes } from "./routes/memories";
import { authRoutes } from "./routes/auth";
import "dotenv/config";

const app = fastify();

app.register(cors, {
  origin: true,
});
app.register(memoriesRoutes);
app.register(authRoutes);

app
  .listen({
    port: 3333,
  })
  .then(() => {
    // eslint-disable-next-line no-console
    console.log("🚀 Server rodando em http://localhost:3333");
  });
