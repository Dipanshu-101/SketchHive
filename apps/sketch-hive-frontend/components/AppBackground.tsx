"use client";

import { usePathname } from "next/navigation";
import { WaterRippleBg } from "@repo/ui";

/**
 * Renders the decorative water-ripple background on every route EXCEPT the
 * whiteboard (`/canvas/*`). The whiteboard paints its own opaque full-screen
 * canvas, so the ripple would be invisible there while still running a second
 * animation loop and global mouse listeners — so we skip mounting it entirely.
 */
export function AppBackground() {
  const pathname = usePathname();
  if (pathname?.startsWith("/canvas")) return null;
  return <WaterRippleBg />;
}
