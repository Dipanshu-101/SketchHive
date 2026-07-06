"use client";

import { usePathname } from "next/navigation";
import { WaterRippleBg } from "@repo/ui";

/**
 * Renders the legacy decorative water-ripple background on routes that still use
 * it. Skipped on:
 *   • `/canvas/*` — the whiteboard paints its own opaque full-screen canvas, so
 *     the ripple would be invisible while still running a second animation loop.
 *   • `/` (marketing) — the redesigned landing owns its honey ambient background;
 *     the blue ripple clashes with the V2 aesthetic.
 *   • `/signin` & `/signup` — the redesigned auth pages own their honey ambient
 *     background (via AuthLayout); the blue ripple clashes with the V2 aesthetic.
 *
 * Rooms still uses it until it is redesigned; this component is the single
 * switch for retiring it route by route.
 */
export function AppBackground() {
  const pathname = usePathname();
  if (pathname?.startsWith("/canvas")) return null;
  if (pathname === "/") return null;
  if (pathname === "/signin" || pathname === "/signup") return null;
  return <WaterRippleBg />;
}
