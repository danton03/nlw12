import fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import { memoriesRoutes } from "./routes/memories";
import { authRoutes } from "./routes/auth";
import "dotenv/config";

const app = fastify();

const SECRET: string = process.env.JWT_SECRET || "spacetime";

app.register(cors, {
  origin: true,
});

app.register(jwt, {
  secret: SECRET,
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
