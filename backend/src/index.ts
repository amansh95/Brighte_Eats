import { createServer } from "node:http";
import { createSchema, createYoga } from "graphql-yoga";

const schema = createSchema({
  typeDefs: `
    type Query {
      hello: String!
    }
  `,
  resolvers: {
    Query: {
      hello: () => "Hello from Brighte Eats!!",
    },
  },
});

const yoga = createYoga({ schema });
const server = createServer(yoga);
const port = Number(process.env.PORT) || 4000;

server.listen(port, () => {
  console.log(`GraphQL server running at http://localhost:${port}/graphql`);
});
