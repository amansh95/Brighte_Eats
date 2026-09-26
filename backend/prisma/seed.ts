import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const serviceTypes = [
  { code: "delivery", label: "Delivery" },
  { code: "pick-up", label: "Pick-up" },
  { code: "payment", label: "Payment" },
];

for (const service of serviceTypes) {
  await prisma.serviceType.upsert({
    where: { code: service.code },
    update: { label: service.label },
    create: service,
  });
}

console.log(`Seeded ${serviceTypes.length} service types.`);
await prisma.$disconnect();
