import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";

export async function memoriesRoutes(app: FastifyInstance) {
  app.addHook("preHandler", async (request) => {
    await request.jwtVerify();
  });

  app.get("/memories", async (req) => {
    const memories = await prisma.memory.findMany({
      where: {
        userId: req.user.sub,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    return memories.map((memory) => {
      return {
        id: memory.id,
        cover: memory.coverURL,
        except: memory.content.substring(0, 115).concat("..."),
      };
    });
  });

  app.get("/memories/:id", async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });
    const { id } = paramsSchema.parse(request.params);
    const memory = await prisma.memory.findUniqueOrThrow({ where: { id } });
    if (!memory.isPublic && memory.userId !== request.user.sub) {
      return reply.status(401).send();
    }
    return memory;
  });

  app.post("/memories:", async (request) => {
    const bodySchema = z.object({
      coverUrl: z.string(),
      content: z.string(),
      isPublic: z.coerce.boolean().default(false),
    });
    const { coverUrl, content, isPublic } = bodySchema.parse(request.body);
    const memory = await prisma.memory.create({
      data: {
        coverURL: coverUrl,
        content,
        isPublic,
        userId: "e089d999-6a9a-4ea6-a04d-a173904b9a3d",
      },
    });
    return memory;
  });

  app.put("/memories/:id", async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });
    const { id } = paramsSchema.parse(request.params);

    const bodySchema = z.object({
      coverUrl: z.string(),
      content: z.string(),
      isPublic: z.coerce.boolean().default(false),
    });

    const { coverUrl, content, isPublic } = bodySchema.parse(request.body);

    let memory = await prisma.memory.findUniqueOrThrow({
      where: { id },
    });

    if (memory.userId !== request.user.sub) {
      reply.status(401).send();
    }

    memory = await prisma.memory.update({
      where: { id },
      data: {
        coverURL: coverUrl,
        content,
        isPublic,
      },
    });
    return memory;
  });

  app.delete("/memories/:id", async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });
    const { id } = paramsSchema.parse(request.params);

    const memory = await prisma.memory.findUniqueOrThrow({
      where: { id },
    });

    if (memory.userId !== request.user.sub) {
      reply.status(401).send();
    }

    await prisma.memory.delete({ where: { id } });
  });
}
