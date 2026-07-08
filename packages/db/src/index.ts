import path from "path";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// In hosted environments (Railway, Vercel) DATABASE_URL is injected directly
// into process.env. For local development we additionally load the package-local
// .env file. dotenv does NOT override variables that are already set, so the
// platform-injected value always wins in production.
//
// After compilation __dirname is `dist/`, so `../.env` resolves to the package
// root — the same place the .env lives during development.
const envPath = path.resolve(__dirname, "../.env");
dotenv.config({ path: envPath });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is not set. Configure it in the environment (Railway service " +
      "variables) or in packages/db/.env for local development."
  );
}

const pool = new Pool({
  connectionString: databaseUrl,
  // node-postgres does not understand libpq's `sslmode=verify-full` /
  // `channel_binding` URL params, so configure TLS explicitly.
  ssl: { rejectUnauthorized: true },
});

const adapter = new PrismaPg(pool);

let prismaClient: PrismaClient | null = null;

export function getPrismaClient() {
  if (!prismaClient) {
    prismaClient = new PrismaClient({
      adapter,
    });
  }

  return prismaClient;
}

export const prismaClientLazy = new Proxy({} as any, {
  get: (_target, prop) => {
    const client = getPrismaClient();
    return (client as any)[prop];
  },
});
