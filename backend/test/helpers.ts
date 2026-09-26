import { prisma } from "../src/prisma.js";

export async function clearLeads() {
  await prisma.leadService.deleteMany();
  await prisma.lead.deleteMany();
}
