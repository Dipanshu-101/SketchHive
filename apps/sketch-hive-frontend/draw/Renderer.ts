/**
 * The Renderer owns the canvas painting. It never holds document state — it is
 * handed the current scene each frame and rebuilds the canvas from scratch:
 *
 *     clear -> draw every committed shape -> draw the in-progress preview ->
 *     draw the selection box
 *
 * Redraws are coalesced with requestAnimationFrame so that a burst of mouse
 * events in one frame results in exactly one paint (performance requirement).
 */
import type { Shape } from "./shapes/Shape";
import type { Bounds } from "./types";

export interface Scene {
  /** Committed shapes, drawn in insertion order. */
  shapes: Shape[];
  /** The shape currently being drawn (rubber-band preview), if any. */
  preview: Shape | null;
  /** Bounding box to outline as the current selection, if any. */
  selectionBounds: Bounds | null;
}

export class Renderer {
  private ctx: CanvasRenderingContext2D;
  private rafId: number | null = null;
  private getScene: () => Scene;

  constructor(canvas: HTMLCanvasElement, getScene: () => Scene) {
    this.ctx = canvas.getContext("2d")!;
    this.getScene = getScene;
  }

  /** Request a redraw; multiple calls in one frame collapse into one paint. */
  schedule(): void {
    if (this.rafId !== null) return;
    this.rafId = requestAnimationFrame(() => {
      this.rafId = null;
      this.paint();
    });
  }

  private paint(): void {
    const ctx = this.ctx;
    const canvas = ctx.canvas;
    const scene = this.getScene();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#0b0b0f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (const shape of scene.shapes) {
      shape.draw(ctx);
    }

    if (scene.preview) {
      scene.preview.draw(ctx);
    }

    if (scene.selectionBounds) {
      this.drawSelection(scene.selectionBounds);
    }
  }

  /** Dashed bounding box + corner handles (handles are visual hooks for resize). */
  private drawSelection(b: Bounds): void {
    const ctx = this.ctx;
    const pad = 6;
    const x = b.x - pad;
    const y = b.y - pad;
    const w = b.width + pad * 2;
    const h = b.height + pad * 2;

    ctx.save();
    ctx.strokeStyle = "#4f8cff";
    ctx.lineWidth = 1;
    ctx.setLineDash([6, 4]);
    ctx.strokeRect(x, y, w, h);

    ctx.setLineDash([]);
    ctx.fillStyle = "#4f8cff";
    const handle = 6;
    const corners: Array<[number, number]> = [
      [x, y],
      [x + w, y],
      [x, y + h],
      [x + w, y + h],
    ];
    for (const [cx, cy] of corners) {
      ctx.fillRect(cx - handle / 2, cy - handle / 2, handle, handle);
    }
    ctx.restore();
  }

  destroy(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }
}
