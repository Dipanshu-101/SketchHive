import { PrismaClient } from "@prisma/client";
export const prismaClient = new PrismaClient();

/*
MONOREPO PACKAGE REVISION NOTES

1. Packages are created to store reusable code that may be needed by
   multiple apps (frontend, backend, websocket server, etc.).

   Examples:

   * Database client (Prisma)
   * Shared types/interfaces
   * Utility functions
   * Authentication helpers
   * UI components
   * Common configs

2. Every package is like a mini npm package.

   Example:
   packages/db
   packages/backend-common
   packages/ui

3. Usually create a package using:

   npm init -y

4. Every package can have its own tsconfig.json.

   To avoid repeating TypeScript settings, the package usually extends
   a shared config:

   {
   "extends": "@repo/typescript-config/base.json"
   }

5. The shared tsconfig package is added as a devDependency because it
   is only needed while developing/building.

6. Code is exported from files (usually src/index.ts).

   Example:

   export const prisma = new PrismaClient();

7. package.json exports define which files are publicly accessible
   outside the package.

   Example:

   {
   "exports": {
   ".": "./src/index.ts",
   "./config": "./src/config.ts"
   }
   }

8. Other apps import using the package name instead of relative paths.

   Good:
   import { prisma } from "@repo/db";

   Avoid:
   import { prisma } from "../../../packages/db/src/index";

9. Import Resolution:

   import ... from "./file"
   → Relative file path

   import ... from "@repo/db"
   → Workspace package

   import ... from "@prisma/client"
   → Package inside node_modules

10. Goal of packages:

    * Reuse code
    * Avoid duplication
    * Keep apps independent
    * Share common functionality across the monorepo
      */
