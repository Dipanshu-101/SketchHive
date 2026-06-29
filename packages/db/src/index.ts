import path from "path";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

console.log("PrismaClient =", PrismaClient);

const envPath = path.resolve(__dirname, "../.env");
console.log("[db package] loading .env from", envPath);

dotenv.config({ path: envPath });

const databaseUrl = process.env.DATABASE_URL;

console.log(
  "[db package] DATABASE_URL present:",
  Boolean(databaseUrl)
);

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is required for Prisma client initialization"
  );
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // node-postgres does not understand libpq's `sslmode=verify-full` /
  // `channel_binding` URL params, so configure TLS explicitly.
  ssl: { rejectUnauthorized: true },
});

const adapter = new PrismaPg(pool);

let prismaClient: PrismaClient | null = null;

export function getPrismaClient() {
  if (!prismaClient) {
    console.log("[db package] initializing PrismaClient");

    prismaClient = new PrismaClient({
      adapter,
    });

    console.log("[db package] PrismaClient initialized successfully");
  }

  return prismaClient;
}

export const prismaClientLazy = new Proxy({} as any, {
  get: (_target, prop) => {
    const client = getPrismaClient();
    return (client as any)[prop];
  },
});