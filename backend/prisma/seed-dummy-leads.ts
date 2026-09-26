import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const names = [
  "Olivia Smith", "Jack Brown", "Charlotte Wilson", "Noah Taylor", "Amelia Jones",
  "William Nguyen", "Isla Martin", "Oliver White", "Mia Thompson", "Leo Harris",
];

const serviceTypes = await prisma.serviceType.findMany();
let created = 0;

for (const [i, name] of names.entries()) {
  const email = `${name.toLowerCase().replace(" ", ".")}@example.com`;
  const existing = await prisma.lead.findUnique({ where: { emailNormalized: email } });
  if (existing) continue;

  const services = serviceTypes.filter((_, s) => (i + s) % 2 === 0);
  await prisma.lead.create({
    data: {
      name,
      email,
      emailNormalized: email,
      mobile: `04${String(10000000 + i * 1234567).slice(0, 8)}`,
      postcode: String(2000 + i * 11),
      services: {
        create: services.map((service) => ({ serviceTypeId: service.id })),
      },
    },
  });
  created += 1;
}

console.log(`Created ${created} new dummy leads (${names.length - created} already existed and were left untouched).`);
await prisma.$disconnect();
