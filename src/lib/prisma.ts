import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pgPool: Pool | undefined;
};

function makePrismaClient() {
  if (!globalForPrisma.pgPool) {
    const connectionString = process.env.DATABASE_URL || "";
    globalForPrisma.pgPool = new Pool({ connectionString, max: 10 });
  }
  
  const adapter = new PrismaPg(globalForPrisma.pgPool);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? makePrismaClient();
export const db = prisma;

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
