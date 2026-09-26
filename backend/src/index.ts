import { createServer } from "node:http";
import { createYoga } from "graphql-yoga";
import { schema } from "./schema.js";
import { handleRestRequest } from "./rest.js";

const yoga = createYoga({
  schema,
  cors: { origin: process.env.FRONTEND_URL ?? "http://localhost:3000" },
});

const server = createServer(async (req, res) => {
  if (await handleRestRequest(req, res)) return;
  await yoga(req, res);
});
const port = Number(process.env.PORT) || 4000;

server.listen(port, () => {
  console.log(`GraphQL server running at http://localhost:${port}/graphql`);
  console.log(`REST leads API running at http://localhost:${port}/leads`);
});
