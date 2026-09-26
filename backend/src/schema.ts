import { createSchema } from "graphql-yoga";
import { getLead, getLeads, getServiceTypes, registerLead, type LeadSortField, type SortDirection } from "./leads.js";

const typeDefs = `
  type ServiceType {
    code: String!
    label: String!
  }

  type Lead {
    id: ID!
    name: String!
    email: String!
    mobile: String!
    postcode: String!
    services: [ServiceType!]!
    createdAt: String!
  }

  type LeadPage {
    items: [Lead!]!
    totalCount: Int!
    limit: Int!
    offset: Int!
  }

  enum LeadSortField {
    CREATED_AT
    NAME
  }

  enum SortDirection {
    ASC
    DESC
  }

  input RegisterInput {
    name: String!
    email: String!
    mobile: String!
    postcode: String!
    services: [String!]!
  }

  type Query {
    serviceTypes: [ServiceType!]!
    leads(
      limit: Int = 20
      offset: Int = 0
      services: [String!]
      sortBy: LeadSortField = CREATED_AT
      sortDir: SortDirection = DESC
    ): LeadPage!
    lead(id: ID!): Lead
  }

  type Mutation {
    register(input: RegisterInput!): Lead!
  }
`;

const resolvers = {
  Query: {
    serviceTypes: () => getServiceTypes(),

    leads: (
      _parent: unknown,
      args: { limit: number; offset: number; services?: string[]; sortBy: LeadSortField; sortDir: SortDirection },
    ) => getLeads(args),

    lead: (_parent: unknown, args: { id: string }) => getLead(args.id),
  },

  Mutation: {
    register: (
      _parent: unknown,
      args: { input: { name: string; email: string; mobile: string; postcode: string; services: string[] } },
    ) => registerLead(args.input),
  },
};

export const schema = createSchema({ typeDefs, resolvers });
