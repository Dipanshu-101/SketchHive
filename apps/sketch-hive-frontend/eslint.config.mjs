import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import { noRawHex } from "@repo/eslint-config/no-raw-hex";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Design-token drift guard (§13) — WARNS on raw hex in feature/page code so
  // colors migrate to the token layer over time. Not an error: the existing
  // pages still hold literals pending their redesign in later phases.
  ...noRawHex,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
