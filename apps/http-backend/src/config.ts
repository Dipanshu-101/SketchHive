/**
 * HTTP backend configuration. Centralizes the few tunables so they aren't
 * scattered across the codebase. Reads from the environment where sensible,
 * with a safe local default.
 */
export const PORT = Number(process.env.PORT) || 3001;
