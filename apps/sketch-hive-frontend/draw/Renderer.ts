/**
 * The Renderer owns the canvas painting. It never holds document state — it is
 * handed the current scene each frame and rebuilds the canvas from scratch.
 *
 * Per-frame order (the camera makes the canvas an infinite plane):
 *
 *     clear -> fill background -> draw infinite grid -> draw committed shapes ->
 *     draw the in-progress preview -> draw the selection box
 *
 * Shapes, grid and preview live in WORLD space. Rather than asking every shape
 * to convert its own coordinates, we install the camera transform on the 2D
 * context ONCE (ctx.setTransform) and let the GPU map world -> screen for free.
 * That keeps the shape classes camera-agnostic: they still draw in world units.
 *
 * Redraws are coalesced with requestAnimationFrame so that a burst of mouse
 * events in one frame results in exactly one paint (performance requirement).
 */
import type { Shape } from "./shapes/Shape";
import type { Bounds, Camera } from "./types";

export interface Scene {
  /** Committed shapes, drawn in insertion order. */
  shapes: Shape[];
  /** The shape currently being drawn (rubber-band preview), if any. */
  preview: Shape | null;
  /** Bounding box to outline as the current selection, if any. */
  selectionBounds: Bounds | null;
  /** The viewport offset + zoom; world coords are mapped through this. */
  camera: Camera;
}

const BACKGROUND = "#0b0b0f";

/** Minor grid: thin lines every 32 world units. */
const MINOR_SPACING = 32;
const MINOR_COLOR = "rgba(255,255,255,0.05)";

/** Major grid: brighter line every 5th minor line (160 world units). */
const MAJOR_EVERY = 5;
const MAJOR_COLOR = "rgba(255,255,255,0.10)";

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
    const { camera } = scene;

    // 1 + 2. Clear and fill the background in raw screen space (identity
    //        transform) so it always covers the whole viewport regardless of
    //        where the camera is.
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = BACKGROUND;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 3. Grid. Drawn in screen space too, but stepped using world-aligned
    //    offsets so it scrolls with the camera and stays crisp at any pan.
    this.drawGrid(camera, canvas.width, canvas.height);

    // Install the camera transform: from here on we draw in WORLD coordinates
    // and the context maps them to the screen. setTransform(zoom,0,0,zoom,tx,ty)
    // is exactly screenX = worldX*zoom - camera.x*zoom = (worldX - camera.x)*zoom.
    ctx.setTransform(
      camera.zoom,
      0,
      0,
      camera.zoom,
      -camera.x * camera.zoom,
      -camera.y * camera.zoom,
    );

    // 4. Committed shapes, in world space.
    for (const shape of scene.shapes) {
      shape.draw(ctx);
    }

    // 5. In-progress preview, in world space.
    if (scene.preview) {
      scene.preview.draw(ctx);
    }

    // 6. Selection handles. Drawn under the camera transform so the box tracks
    //    the shape while panning. lineWidth/handle sizes are divided by zoom so
    //    they keep a constant on-screen thickness as zoom changes.
    if (scene.selectionBounds) {
      this.drawSelection(scene.selectionBounds, camera.zoom);
    }

    // Leave the context in identity state for the next frame's screen-space ops.
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  /**
   * Draw only the grid lines visible in the current viewport.
   *
   * We never allocate an infinite canvas or build arrays of lines: we compute
   * the first world-aligned line just left of / above the screen and step by
   * the (zoom-scaled) spacing until we pass the right / bottom edge. The loop
   * count is therefore bounded by the number of lines actually on screen.
   */
  private drawGrid(camera: Camera, screenW: number, screenH: number): void {
    const ctx = this.ctx;
    const step = MINOR_SPACING * camera.zoom;

    // Defensive: if zoom ever shrinks the step below a pixel, skip the minor
    // grid to avoid a moiré wall of lines (and a pointless tight loop).
    if (step < 4) return;

    // World coordinates of the screen's top-left and bottom-right corners.
    const worldLeft = camera.x;
    const worldTop = camera.y;
    const worldRight = camera.x + screenW / camera.zoom;
    const worldBottom = camera.y + screenH / camera.zoom;

    // First grid index (in units of MINOR_SPACING) at or before each edge.
    const startCol = Math.floor(worldLeft / MINOR_SPACING);
    const endCol = Math.ceil(worldRight / MINOR_SPACING);
    const startRow = Math.floor(worldTop / MINOR_SPACING);
    const endRow = Math.ceil(worldBottom / MINOR_SPACING);

    ctx.save();
    ctx.lineWidth = 1;

    // Vertical lines.
    for (let col = startCol; col <= endCol; col++) {
      const worldX = col * MINOR_SPACING;
      const screenX = Math.round((worldX - camera.x) * camera.zoom) + 0.5;
      ctx.strokeStyle = col % MAJOR_EVERY === 0 ? MAJOR_COLOR : MINOR_COLOR;
      ctx.beginPath();
      ctx.moveTo(screenX, 0);
      ctx.lineTo(screenX, screenH);
      ctx.stroke();
    }

    // Horizontal lines.
    for (let row = startRow; row <= endRow; row++) {
      const worldY = row * MINOR_SPACING;
      const screenY = Math.round((worldY - camera.y) * camera.zoom) + 0.5;
      ctx.strokeStyle = row % MAJOR_EVERY === 0 ? MAJOR_COLOR : MINOR_COLOR;
      ctx.beginPath();
      ctx.moveTo(0, screenY);
      ctx.lineTo(screenW, screenY);
      ctx.stroke();
    }

    ctx.restore();
  }

  /** Dashed bounding box + corner handles (handles are visual hooks for resize). */
  private drawSelection(b: Bounds, zoom: number): void {
    const ctx = this.ctx;
    // Keep visual padding / stroke / handle sizes constant on screen by
    // dividing the world-space values by zoom.
    const pad = 6 / zoom;
    const x = b.x - pad;
    const y = b.y - pad;
    const w = b.width + pad * 2;
    const h = b.height + pad * 2;

    ctx.save();
    ctx.strokeStyle = "#4f8cff";
    ctx.lineWidth = 1 / zoom;
    ctx.setLineDash([6 / zoom, 4 / zoom]);
    ctx.strokeRect(x, y, w, h);

    ctx.setLineDash([]);
    ctx.fillStyle = "#4f8cff";
    const handle = 6 / zoom;
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
