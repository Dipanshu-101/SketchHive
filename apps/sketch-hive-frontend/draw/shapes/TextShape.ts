import { Shape } from "./Shape";
import { pointInBounds } from "../geometry";
import type { Bounds, TextData } from "../types";

/**
 * Rendered text. Editing happens through a temporary HTML textarea overlay
 * (managed by the Game), and the committed string is rendered here onto the
 * canvas. (x,y) is the top-left of the first line.
 */
export class TextShape extends Shape {
  readonly type = "text" as const;

  constructor(private data: TextData) {
    super(data.id, data.style);
  }

  private font(): string {
    return `${this.data.fontSize}px sans-serif`;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.style.stroke;
    ctx.font = this.font();
    ctx.textBaseline = "top";
    const lineHeight = this.data.fontSize * 1.2;
    this.data.text.split("\n").forEach((line, i) => {
      ctx.fillText(line, this.data.x, this.data.y + i * lineHeight);
    });
  }

  contains(x: number, y: number): boolean {
    return pointInBounds(x, y, this.getBounds(), 4);
  }

  getBounds(): Bounds {
    const lines = this.data.text.split("\n");
    const lineHeight = this.data.fontSize * 1.2;
    // Approximate width using an average glyph ratio; good enough for hit-test
    // and the selection box without measuring on every call.
    const longest = lines.reduce((m, l) => Math.max(m, l.length), 0);
    const width = longest * this.data.fontSize * 0.6;
    return {
      x: this.data.x,
      y: this.data.y,
      width,
      height: lines.length * lineHeight,
    };
  }

  move(dx: number, dy: number): void {
    this.data = { ...this.data, x: this.data.x + dx, y: this.data.y + dy };
  }

  serialize(): TextData {
    return { ...this.data, style: { ...this.style } };
  }
}
