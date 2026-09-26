import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const names = [
  "Olivia Smith", "Jack Brown", "Charlotte Wilson", "Noah Taylor", "Amelia Jones",
  "William Nguyen", "Isla Martin", "Oliver White", "Mia Thompson", "Leo Harris",
];

const serviceTypes = await prisma.serviceType.findMany();

for (const [i, name] of names.entries()) {
  const email = `${name.toLowerCase().replace(" ", ".")}@example.com`;
  const services = serviceTypes.filter((_, s) => (i + s) % 2 === 0);

  await prisma.lead.upsert({
    where: { emailNormalized: email },
    update: {},
    create: {
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
}

console.log(`Seeded ${names.length} dummy leads.`);
await prisma.$disconnect();
