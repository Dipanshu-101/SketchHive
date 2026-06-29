import { Shape } from "./Shape";
import { arrowHeadPoints, distanceToSegment, normalizeBox } from "../geometry";
import type { ArrowData, Bounds } from "../types";

/**
 * An arrow = a main line + a filled arrowhead at the tip. The head angle is
 * derived from the segment direction (see arrowHeadPoints) so it rotates
 * correctly no matter which way the user drags.
 */
export class Arrow extends Shape {
  readonly type = "arrow" as const;

  constructor(private data: ArrowData) {
    super(data.id, data.style);
  }

  draw(ctx: CanvasRenderingContext2D): void {
    this.applyStyle(ctx);
    const { x1, y1, x2, y2 } = this.data;

    // Main line.
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();

    // Arrowhead at the tip (x2,y2).
    const headSize = 12 + this.style.lineWidth * 2;
    const [a, b] = arrowHeadPoints(x1, y1, x2, y2, headSize);
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.closePath();
    ctx.fillStyle = this.style.stroke;
    ctx.fill();
  }

  contains(x: number, y: number): boolean {
    const { x1, y1, x2, y2 } = this.data;
    return distanceToSegment(x, y, x1, y1, x2, y2) <= this.style.lineWidth + 6;
  }

  getBounds(): Bounds {
    const { x1, y1, x2, y2 } = this.data;
    return normalizeBox(x1, y1, x2, y2);
  }

  move(dx: number, dy: number): void {
    this.data = {
      ...this.data,
      x1: this.data.x1 + dx,
      y1: this.data.y1 + dy,
      x2: this.data.x2 + dx,
      y2: this.data.y2 + dy,
    };
  }

  serialize(): ArrowData {
    return { ...this.data, style: { ...this.style } };
  }
}
