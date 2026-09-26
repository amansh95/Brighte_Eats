import { createServer } from "./server.js";

const server = createServer();
const port = Number(process.env.PORT) || 4000;

server.listen(port, () => {
  console.log(`GraphQL server running at http://localhost:${port}/graphql`);
  console.log(`REST leads API running at http://localhost:${port}/leads`);
});
