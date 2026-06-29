/**
 * Pure, reusable geometry helpers.
 *
 * Every hit-test and overlay math lives here so that shape classes stay small
 * and there is exactly ONE implementation of each algorithm (no copy-paste of
 * "distance to a line segment" across Line, Arrow, etc.).
 */
import type { Bounds, Point } from "./types";

/** Crypto-strong-ish id without pulling in a dependency. */
export function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  // Fallback for non-secure contexts.
  return `s-${Math.random().toString(36).slice(2)}-${performance.now().toString(36)}`;
}

/** Normalize a drag (which may go any direction) into a top-left + size box. */
export function normalizeBox(x1: number, y1: number, x2: number, y2: number): Bounds {
  return {
    x: Math.min(x1, x2),
    y: Math.min(y1, y2),
    width: Math.abs(x2 - x1),
    height: Math.abs(y2 - y1),
  };
}

export function pointInBounds(px: number, py: number, b: Bounds, pad = 0): boolean {
  return (
    px >= b.x - pad &&
    px <= b.x + b.width + pad &&
    py >= b.y - pad &&
    py <= b.y + b.height + pad
  );
}

/** Shortest distance from point (px,py) to the segment (x1,y1)-(x2,y2). */
export function distanceToSegment(
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return Math.hypot(px - x1, py - y1);
  // Project point onto the segment, clamped to [0,1].
  let t = ((px - x1) * dx + (py - y1) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  const projX = x1 + t * dx;
  const projY = y1 + t * dy;
  return Math.hypot(px - projX, py - projY);
}

/** Distance from a point to an axis-aligned ellipse outline (approx via scaling). */
export function pointNearEllipse(
  px: number,
  py: number,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  tolerance: number,
): boolean {
  if (rx <= 0 || ry <= 0) return false;
  // Normalized radial value: 1 means exactly on the outline.
  const nx = (px - cx) / rx;
  const ny = (py - cy) / ry;
  const value = nx * nx + ny * ny;
  // Convert tolerance (in px) into a band around value === 1.
  const band = (tolerance / Math.min(rx, ry)) * 2;
  return Math.abs(value - 1) <= band || value <= 1; // also allow clicking inside
}

/** Bounding box that encloses a list of points (used by FreeStroke). */
export function boundsOfPoints(points: Point[]): Bounds {
  if (points.length === 0) return { x: 0, y: 0, width: 0, height: 0 };
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const p of points) {
    if (p.x < minX) minX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.x > maxX) maxX = p.x;
    if (p.y > maxY) maxY = p.y;
  }
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

/** Even-odd point-in-polygon test for an array of vertices. */
export function pointInPolygon(px: number, py: number, vertices: Point[]): boolean {
  let inside = false;
  for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
    const vi = vertices[i]!;
    const vj = vertices[j]!;
    const intersects =
      vi.y > py !== vj.y > py &&
      px < ((vj.x - vi.x) * (py - vi.y)) / (vj.y - vi.y) + vi.x;
    if (intersects) inside = !inside;
  }
  return inside;
}

/** Stroke (and optionally fill) a closed polygon from a list of vertices. */
export function strokePolygon(
  ctx: CanvasRenderingContext2D,
  vertices: Point[],
  fill?: string,
): void {
  if (vertices.length === 0) return;
  ctx.beginPath();
  ctx.moveTo(vertices[0]!.x, vertices[0]!.y);
  for (let i = 1; i < vertices.length; i++) {
    ctx.lineTo(vertices[i]!.x, vertices[i]!.y);
  }
  ctx.closePath();
  if (fill && fill !== "transparent") {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  ctx.stroke();
}

/**
 * Returns the two base points of an arrowhead triangle at the tip (tipX,tipY)
 * for a line coming from (fromX,fromY). The head rotates correctly for ANY
 * direction because we derive the angle straight from the segment.
 */
export function arrowHeadPoints(
  fromX: number,
  fromY: number,
  tipX: number,
  tipY: number,
  size = 14,
): [Point, Point] {
  const angle = Math.atan2(tipY - fromY, tipX - fromX);
  const spread = Math.PI / 7; // ~25 degrees on each side
  return [
    {
      x: tipX - size * Math.cos(angle - spread),
      y: tipY - size * Math.sin(angle - spread),
    },
    {
      x: tipX - size * Math.cos(angle + spread),
      y: tipY - size * Math.sin(angle + spread),
    },
  ];
}
