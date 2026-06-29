/**
 * Abstract base class for every drawable object.
 *
 * A Shape is the LIVE, behavioural form of a ShapeData. It knows how to:
 *   - draw itself onto a 2D context
 *   - test whether a point hits it (selection / eraser)
 *   - report its bounding box (selection box + eraser)
 *   - move by a delta (selection drag)
 *   - serialize back into plain ShapeData (history + network)
 *
 * Subclasses implement the abstract methods. The renderer and the rest of the
 * engine only ever talk to this interface — they never branch on shape type.
 * This is what removes the giant if/else chains from the old implementation.
 */
import type { Bounds, ShapeData, ShapeStyle } from "../types";

export abstract class Shape {
  readonly id: string;
  style: ShapeStyle;

  constructor(id: string, style: ShapeStyle) {
    this.id = id;
    this.style = style;
  }

  /** The discriminator string, mirrors ShapeData["type"]. */
  abstract readonly type: ShapeData["type"];

  /** Render the shape using its own style. */
  abstract draw(ctx: CanvasRenderingContext2D): void;

  /** True if the world-space point (x,y) selects/erases this shape. */
  abstract contains(x: number, y: number): boolean;

  /** Axis-aligned bounding box in world space. */
  abstract getBounds(): Bounds;

  /** Translate the shape by (dx,dy). Mutates in place. */
  abstract move(dx: number, dy: number): void;

  /** Produce an immutable plain-data snapshot for history + network. */
  abstract serialize(): ShapeData;

  /** Shared helper so subclasses don't repeat stroke/fill boilerplate. */
  protected applyStyle(ctx: CanvasRenderingContext2D): void {
    ctx.strokeStyle = this.style.stroke;
    ctx.lineWidth = this.style.lineWidth;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
  }
}
