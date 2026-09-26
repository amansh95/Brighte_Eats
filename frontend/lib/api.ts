import {
  ApiError,
  type Lead,
  type LeadsPage,
  type LeadsQuery,
  type RegisterInput,
  type ServiceType,
} from "./types";

const MOCK_DELAY_MS = Number(process.env.NEXT_PUBLIC_MOCK_API_DELAY_MS ?? 600);
const MOCK_FAIL = process.env.NEXT_PUBLIC_MOCK_API_FAIL === "true";

const serviceTypes: ServiceType[] = [
  { code: "delivery", label: "Delivery" },
  { code: "pick-up", label: "Pick-up" },
  { code: "payment", label: "Payment" },
];

const names = [
  "Olivia Smith", "Jack Brown", "Charlotte Wilson", "Noah Taylor", "Amelia Jones",
  "William Nguyen", "Isla Martin", "Oliver White", "Mia Thompson", "Leo Harris",
  "Ava Walker", "Henry Lee", "Grace King", "Lucas Wright", "Chloe Scott",
  "Thomas Green", "Zoe Baker", "James Hall", "Ruby Young", "Ethan Allen",
  "Sophie Clarke", "Max Roberts", "Ella Turner", "Oscar Evans",
];

const leads: Lead[] = names.map((name, i) => ({
  id: String(i + 1),
  name,
  email: `${name.toLowerCase().replace(" ", ".")}@example.com`,
  mobile: `04${String(10000000 + i * 1234567).slice(0, 8)}`,
  postcode: String(2000 + ((i * 37) % 900)),
  services: serviceTypes.filter((_, s) => (i + s) % 3 !== 0 || s === i % 3),
  createdAt: new Date(Date.UTC(2026, 8, 1 + i, 9, i)).toISOString(),
}));

async function mockCall<T>(fn: () => T): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
  if (MOCK_FAIL) throw new ApiError("Could not reach the server.", "NETWORK");
  return fn();
}

export function getServiceTypes(): Promise<ServiceType[]> {
  return mockCall(() => serviceTypes);
}

export function getLeads({
  limit,
  offset,
  services = [],
  sortBy = "createdAt",
  sortDir = "desc",
}: LeadsQuery): Promise<LeadsPage> {
  return mockCall(() => {
    const filtered = services.length
      ? leads.filter((lead) => lead.services.some((s) => services.includes(s.code)))
      : leads;
    const sorted = [...filtered].sort((a, b) => {
      const cmp = a[sortBy].localeCompare(b[sortBy]) || a.id.localeCompare(b.id);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return {
      items: sorted.slice(offset, offset + limit),
      totalCount: filtered.length,
      limit,
      offset,
    };
  });
}

export function getLead(id: string): Promise<Lead> {
  return mockCall(() => {
    return leads.find((l) => l.id === id)!;
  });
}

export function register(input: RegisterInput): Promise<Lead> {
  return mockCall(() => {
    const lead: Lead = {
      id: String(leads.length + 1),
      ...input,
      services: serviceTypes.filter((s) => input.services.includes(s.code)),
      createdAt: new Date().toISOString(),
    };
    leads.push(lead);
    return lead;
  });
}
