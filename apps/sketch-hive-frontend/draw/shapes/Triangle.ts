import { Shape } from "./Shape";
import { pointInPolygon, strokePolygon } from "../geometry";
import type { Bounds, Point, TriangleData } from "../types";

/** Isosceles triangle inscribed in its bounding box (apex centred at top). */
export class Triangle extends Shape {
  readonly type = "triangle" as const;

  constructor(private data: TriangleData) {
    super(data.id, data.style);
  }

  private vertices(): Point[] {
    const b = this.getBounds();
    return [
      { x: b.x + b.width / 2, y: b.y }, // apex
      { x: b.x, y: b.y + b.height }, // bottom-left
      { x: b.x + b.width, y: b.y + b.height }, // bottom-right
    ];
  }

  draw(ctx: CanvasRenderingContext2D): void {
    this.applyStyle(ctx);
    strokePolygon(ctx, this.vertices(), this.style.fill);
  }

  contains(x: number, y: number): boolean {
    return pointInPolygon(x, y, this.vertices());
  }

  getBounds(): Bounds {
    const { x, y, width, height } = this.data;
    return {
      x: Math.min(x, x + width),
      y: Math.min(y, y + height),
      width: Math.abs(width),
      height: Math.abs(height),
    };
  }

  move(dx: number, dy: number): void {
    this.data = { ...this.data, x: this.data.x + dx, y: this.data.y + dy };
  }

  serialize(): TriangleData {
    return { ...this.data, style: { ...this.style } };
  }
}
