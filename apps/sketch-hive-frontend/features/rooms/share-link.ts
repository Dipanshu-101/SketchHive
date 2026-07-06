/**
 * share-link — builds the shareable room URL from the current origin.
 *
 * The link points at the existing canvas route (`/canvas/:roomId`), which the
 * app already uses to open a room. Using `window.location.origin` means the
 * link is correct in every environment (localhost, preview, prod) with zero
 * configuration.
 */

/** Absolute shareable URL for a room, e.g. `https://host/canvas/42`. */
export function buildShareUrl(roomId: string | number): string {
  const path = `/canvas/${roomId}`;
  if (typeof window !== "undefined" && window.location?.origin) {
    return `${window.location.origin}${path}`;
  }
  // SSR fallback — a relative path is still a usable, if origin-less, link.
  return path;
}
