import { Shape } from "./Shape";
import { pointInPolygon, strokePolygon } from "../geometry";
import type { Bounds, DiamondData, Point } from "../types";

/** Rhombus whose vertices touch the midpoints of its bounding box edges. */
export class Diamond extends Shape {
  readonly type = "diamond" as const;

  constructor(private data: DiamondData) {
    super(data.id, data.style);
  }

  private vertices(): Point[] {
    const b = this.getBounds();
    const cx = b.x + b.width / 2;
    const cy = b.y + b.height / 2;
    return [
      { x: cx, y: b.y }, // top
      { x: b.x + b.width, y: cy }, // right
      { x: cx, y: b.y + b.height }, // bottom
      { x: b.x, y: cy }, // left
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

  serialize(): DiamondData {
    return { ...this.data, style: { ...this.style } };
  }
}
