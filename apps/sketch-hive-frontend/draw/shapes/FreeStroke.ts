import { Shape } from "./Shape";
import { boundsOfPoints, distanceToSegment } from "../geometry";
import type { Bounds, FreeStrokeData, Point } from "../types";

/**
 * Freehand pencil stroke. Stored as an array of points (never painted blindly)
 * and rendered as a smooth poly-line. Hit-testing checks distance to any of the
 * stroke's segments.
 */
export class FreeStroke extends Shape {
  readonly type = "freestroke" as const;

  constructor(private data: FreeStrokeData) {
    super(data.id, data.style);
  }

  draw(ctx: CanvasRenderingContext2D): void {
    const pts = this.data.points;
    if (pts.length === 0) return;
    this.applyStyle(ctx);
    ctx.beginPath();
    ctx.moveTo(pts[0]!.x, pts[0]!.y);
    if (pts.length === 1) {
      // A single tap: draw a dot.
      ctx.lineTo(pts[0]!.x + 0.01, pts[0]!.y);
    } else {
      // Quadratic smoothing through midpoints for a natural pencil feel.
      for (let i = 1; i < pts.length - 1; i++) {
        const midX = (pts[i]!.x + pts[i + 1]!.x) / 2;
        const midY = (pts[i]!.y + pts[i + 1]!.y) / 2;
        ctx.quadraticCurveTo(pts[i]!.x, pts[i]!.y, midX, midY);
      }
      const last = pts[pts.length - 1]!;
      ctx.lineTo(last.x, last.y);
    }
    ctx.stroke();
    ctx.closePath();
  }

  contains(x: number, y: number): boolean {
    const pts = this.data.points;
    const tolerance = this.style.lineWidth + 6;
    for (let i = 0; i < pts.length - 1; i++) {
      if (distanceToSegment(x, y, pts[i]!.x, pts[i]!.y, pts[i + 1]!.x, pts[i + 1]!.y) <= tolerance) {
        return true;
      }
    }
    // Single-point strokes.
    if (pts.length === 1) {
      return Math.hypot(x - pts[0]!.x, y - pts[0]!.y) <= tolerance;
    }
    return false;
  }

  getBounds(): Bounds {
    return boundsOfPoints(this.data.points);
  }

  move(dx: number, dy: number): void {
    this.data = {
      ...this.data,
      points: this.data.points.map((p: Point) => ({ x: p.x + dx, y: p.y + dy })),
    };
  }

  serialize(): FreeStrokeData {
    return {
      ...this.data,
      points: this.data.points.map((p: Point) => ({ ...p })),
      style: { ...this.style },
    };
  }
}
