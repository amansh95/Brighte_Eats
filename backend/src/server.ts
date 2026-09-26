import { createServer as createHttpServer } from "node:http";
import { createYoga } from "graphql-yoga";
import { schema } from "./schema.js";
import { handleRestRequest } from "./rest.js";

export function createServer() {
  const yoga = createYoga({
    schema,
    cors: { origin: process.env.FRONTEND_URL ?? "http://localhost:3000" },
  });

  return createHttpServer(async (req, res) => {
    if (await handleRestRequest(req, res)) return;
    await yoga(req, res);
  });
}
