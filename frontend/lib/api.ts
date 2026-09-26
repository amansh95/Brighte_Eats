import { ApiError, Lead, LeadsPage, LeadsQuery, RegisterInput, ServiceType } from "./types";

const API_URL = process.env.API_URL ?? "http://localhost:4000/graphql";

async function graphql<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  let response: Response;
  try {
    response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
    });
  } catch {
    throw new ApiError("We couldn't reach the server.", "NETWORK");
  }

  const body = await response.json();
  if (body.errors?.length) {
    const [error] = body.errors;
    throw new ApiError(error.message, error.extensions?.code ?? "BAD_USER_INPUT");
  }
  return body.data;
}

const LEAD_FIELDS = `
  fragment LeadFields on Lead {
    id
    name
    email
    mobile
    postcode
    createdAt
    services {
      code
      label
    }
  }
`;

export async function getServiceTypes(): Promise<ServiceType[]> {
  const data = await graphql<{ serviceTypes: ServiceType[] }>(`
    query GetServiceTypes {
      serviceTypes {
        code
        label
      }
    }
  `);
  return data.serviceTypes;
}

const SORT_FIELD: Record<LeadsQuery["sortBy"] & string, string> = {
  createdAt: "CREATED_AT",
  name: "NAME",
};

export async function getLeads({ limit, offset, services = [], sortBy = "createdAt", sortDir = "desc" }: LeadsQuery): Promise<LeadsPage> {
  const data = await graphql<{ leads: LeadsPage }>(
    `
      ${LEAD_FIELDS}
      query GetLeads($limit: Int, $offset: Int, $services: [String!], $sortBy: LeadSortField, $sortDir: SortDirection) {
        leads(limit: $limit, offset: $offset, services: $services, sortBy: $sortBy, sortDir: $sortDir) {
          totalCount
          limit
          offset
          items {
            ...LeadFields
          }
        }
      }
    `,
    { limit, offset, services, sortBy: SORT_FIELD[sortBy], sortDir: sortDir.toUpperCase() },
  );
  return data.leads;
}

export async function getLead(id: string): Promise<Lead> {
  const data = await graphql<{ lead: Lead }>(
    `
      ${LEAD_FIELDS}
      query GetLead($id: ID!) {
        lead(id: $id) {
          ...LeadFields
        }
      }
    `,
    { id },
  );
  return data.lead;
}

export async function register(input: RegisterInput): Promise<Lead> {
  const data = await graphql<{ register: Lead }>(
    `
      ${LEAD_FIELDS}
      mutation Register($input: RegisterInput!) {
        register(input: $input) {
          ...LeadFields
        }
      }
    `,
    { input },
  );
  return data.register;
}
