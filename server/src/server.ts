import fastify from "fastify";

const app = fastify();

app.get("/hello", () => {
  return "Hello World!";
});

app
  .listen({
    port: 3333,
  })
  .then(() => {
    // eslint-disable-next-line no-console
    console.log("🚀 Server rodando em http://localhost:3333");
  });
