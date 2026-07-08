/**
 * Single Prisma accessor for the HTTP backend.
 *
 * The `@repo/db` package already lazily memoizes one PrismaClient; re-exporting
 * it here gives the rest of the backend ONE import path (`../prisma`) and keeps
 * services from reaching into the db package directly. If the data layer ever
 * changes, only this file does.
 */
import { getPrismaClient } from "@repo/db/client";

export const prisma = getPrismaClient();
