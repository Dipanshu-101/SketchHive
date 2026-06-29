import { Shape } from "./Shape";
import { pointInBounds } from "../geometry";
import type { Bounds, RectangleData } from "../types";

export class Rectangle extends Shape {
  readonly type = "rectangle" as const;

  constructor(
    private data: RectangleData,
  ) {
    super(data.id, data.style);
  }

  draw(ctx: CanvasRenderingContext2D): void {
    this.applyStyle(ctx);
    const { x, y, width, height } = this.data;
    if (this.style.fill && this.style.fill !== "transparent") {
      ctx.fillStyle = this.style.fill;
      ctx.fillRect(x, y, width, height);
    }
    ctx.strokeRect(x, y, width, height);
  }

  contains(x: number, y: number): boolean {
    return pointInBounds(x, y, this.getBounds(), this.style.lineWidth + 4);
  }

  getBounds(): Bounds {
    const { x, y, width, height } = this.data;
    // Normalize in case width/height are negative.
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

  serialize(): RectangleData {
    return { ...this.data, style: { ...this.style } };
  }
}
