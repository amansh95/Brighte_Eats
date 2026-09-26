import { prisma } from "./prisma.js";

export type LeadSortField = "CREATED_AT" | "NAME";
export type SortDirection = "ASC" | "DESC";

export type LeadsArgs = {
  limit: number;
  offset: number;
  services?: string[];
  sortBy?: LeadSortField;
  sortDir?: SortDirection;
};

type LeadWithServices = {
  id: string;
  name: string;
  email: string;
  mobile: string;
  postcode: string;
  createdAt: Date;
  services: { serviceType: { code: string; label: string } }[];
};

function toLead(lead: LeadWithServices) {
  return {
    id: lead.id,
    name: lead.name,
    email: lead.email,
    mobile: lead.mobile,
    postcode: lead.postcode,
    createdAt: lead.createdAt.toISOString(),
    services: lead.services.map((s) => ({ code: s.serviceType.code, label: s.serviceType.label })),
  };
}

const leadInclude = {
  services: { include: { serviceType: true } },
} as const;

export function getServiceTypes() {
  return prisma.serviceType.findMany({ where: { isActive: true }, orderBy: { id: "asc" } });
}

export async function getLeads(args: LeadsArgs) {
  const limit = Math.min(Math.max(args.limit, 1), 100);
  const offset = Math.max(args.offset, 0);
  const orderField = args.sortBy === "NAME" ? "name" : "createdAt";
  const direction = args.sortDir === "ASC" ? "asc" : "desc";

  const where = args.services?.length
    ? { services: { some: { serviceType: { code: { in: args.services } } } } }
    : {};

  const [items, totalCount] = await Promise.all([
    prisma.lead.findMany({
      where,
      include: leadInclude,
      orderBy: [{ [orderField]: direction }, { id: "asc" }],
      take: limit,
      skip: offset,
    }),
    prisma.lead.count({ where }),
  ]);

  return { items: items.map(toLead), totalCount, limit, offset };
}

export async function getLead(id: string) {
  const lead = await prisma.lead.findUnique({ where: { id }, include: leadInclude });
  return lead ? toLead(lead) : null;
}

export async function registerLead(input: {
  name: string;
  email: string;
  mobile: string;
  postcode: string;
  services: string[];
}) {
  const { name, email, mobile, postcode, services } = input;
  const emailNormalized = email.trim().toLowerCase();

  const lead = await prisma.$transaction(async (tx) => {
    const lead = await tx.lead.upsert({
      where: { emailNormalized },
      update: { name, email, mobile, postcode },
      create: { name, email, emailNormalized, mobile, postcode },
    });

    const serviceTypes = await tx.serviceType.findMany({ where: { code: { in: services } } });
    await tx.leadService.createMany({
      data: serviceTypes.map((s) => ({ leadId: lead.id, serviceTypeId: s.id })),
      skipDuplicates: true,
    });

    return tx.lead.findUniqueOrThrow({ where: { id: lead.id }, include: leadInclude });
  });

  return toLead(lead);
}
