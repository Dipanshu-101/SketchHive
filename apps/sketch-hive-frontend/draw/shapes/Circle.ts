import { Shape } from "./Shape";
import { pointNearEllipse } from "../geometry";
import type { Bounds, CircleData } from "../types";

/**
 * "Circle" is really an axis-aligned ellipse so it can be dragged to any size,
 * matching Excalidraw behaviour. Drawn with the canvas ellipse() primitive.
 */
export class Circle extends Shape {
  readonly type = "circle" as const;

  constructor(private data: CircleData) {
    super(data.id, data.style);
  }

  draw(ctx: CanvasRenderingContext2D): void {
    this.applyStyle(ctx);
    const { centerX, centerY, radiusX, radiusY } = this.data;
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, Math.abs(radiusX), Math.abs(radiusY), 0, 0, Math.PI * 2);
    if (this.style.fill && this.style.fill !== "transparent") {
      ctx.fillStyle = this.style.fill;
      ctx.fill();
    }
    ctx.stroke();
    ctx.closePath();
  }

  contains(x: number, y: number): boolean {
    const { centerX, centerY, radiusX, radiusY } = this.data;
    return pointNearEllipse(
      x,
      y,
      centerX,
      centerY,
      Math.abs(radiusX),
      Math.abs(radiusY),
      this.style.lineWidth + 4,
    );
  }

  getBounds(): Bounds {
    const { centerX, centerY, radiusX, radiusY } = this.data;
    const rx = Math.abs(radiusX);
    const ry = Math.abs(radiusY);
    return { x: centerX - rx, y: centerY - ry, width: rx * 2, height: ry * 2 };
  }

  move(dx: number, dy: number): void {
    this.data = {
      ...this.data,
      centerX: this.data.centerX + dx,
      centerY: this.data.centerY + dy,
    };
  }

  serialize(): CircleData {
    return { ...this.data, style: { ...this.style } };
  }
}
