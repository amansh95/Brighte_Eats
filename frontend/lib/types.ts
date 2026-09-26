export type ServiceType = {
  code: string;
  label: string;
};

export type Lead = {
  id: string;
  name: string;
  email: string;
  mobile: string;
  postcode: string;
  services: ServiceType[];
  createdAt: string;
};

export type RegisterInput = {
  name: string;
  email: string;
  mobile: string;
  postcode: string;
  services: string[];
};

export type LeadSortField = "createdAt" | "name";
export type SortDirection = "asc" | "desc";

export type LeadsQuery = {
  limit: number;
  offset: number;
  services?: string[];
  sortBy?: LeadSortField;
  sortDir?: SortDirection;
};

export type LeadsPage = {
  items: Lead[];
  totalCount: number;
  limit: number;
  offset: number;
};

export class ApiError extends Error {
  constructor(
    message: string,
    public code: "BAD_USER_INPUT" | "NETWORK",
    public fieldErrors: Record<string, string> = {},
  ) {
    super(message);
    this.name = "ApiError";
  }
}
