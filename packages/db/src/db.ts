import dotenv from "dotenv";
dotenv.config({ path: new URL("../.env", import.meta.url).pathname });

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = process.env.DATABASE_URL||"postgresql://postgres:9513571949@localhost:5432/chess?schema=public";
if (!connectionString) {
  throw new Error(" DATABASE_URL is missing — check your environment files or process manager.");
}

const adapter = new PrismaPg({ connectionString });

declare global {
  var __prisma: PrismaClient | undefined;
}

export const prisma =
  globalThis.__prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma = prisma;
}
