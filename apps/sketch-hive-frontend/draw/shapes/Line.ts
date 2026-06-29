import { Shape } from "./Shape";
import { distanceToSegment, normalizeBox } from "../geometry";
import type { Bounds, LineData } from "../types";

export class Line extends Shape {
  readonly type = "line" as const;

  constructor(private data: LineData) {
    super(data.id, data.style);
  }

  draw(ctx: CanvasRenderingContext2D): void {
    this.applyStyle(ctx);
    const { x1, y1, x2, y2 } = this.data;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
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

  serialize(): LineData {
    return { ...this.data, style: { ...this.style } };
  }
}
