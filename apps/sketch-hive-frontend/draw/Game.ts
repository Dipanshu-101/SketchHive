/**
 * Game — the orchestrator / controller of the drawing engine.
 *
 * Responsibilities:
 *   - own ALL application state (shapes, history, selection, tool, mouse)
 *   - translate raw mouse events into tool actions (one place, no global hacks)
 *   - drive the Renderer (request redraws, supply the current scene)
 *   - sync changes over the network and apply remote changes
 *   - manage the text-editing overlay
 *
 * It is deliberately the ONLY stateful, imperative module. Shapes, geometry,
 * history, rendering and networking are all small and independently testable.
 */
import { Tool } from "./types";
import type { Bounds, Camera, Point, ShapeData, ShapeStyle } from "./types";
import { Shape } from "./shapes/Shape";
import { createShape, DEFAULT_STYLE } from "./shapes/factory";
import { Renderer, type Scene } from "./Renderer";
import { History } from "./History";
import { buildFrame, decodeNetOp, type NetOp } from "./net";
import { createId, normalizeBox } from "./geometry";
import { getExistingShapes } from "./http";

interface MouseState {
  down: boolean;
  startX: number;
  startY: number;
  lastX: number;
  lastY: number;
}

export class Game {
  // ---- core state ------------------------------------------------------
  private shapes: Shape[] = [];
  private preview: Shape | null = null;
  private selectedId: string | null = null;
  private currentTool: Tool = Tool.Rectangle;
  private style: ShapeStyle = { ...DEFAULT_STYLE };
  private freePoints: { x: number; y: number }[] = [];
  private mouse: MouseState = { down: false, startX: 0, startY: 0, lastX: 0, lastY: 0 };
  private movedDuringDrag = false;

  // ---- viewport --------------------------------------------------------
  /** The window onto the infinite plane. zoom is fixed to 1 for now. */
  private camera: Camera = { x: 0, y: 0, zoom: 1 };
  /** Panning gesture state (Space+drag or middle-mouse drag). */
  private panning = false;
  /** True while the Space key is held, arming left-drag panning. */
  private spaceDown = false;
  /** Screen-space anchor where the current pan began. */
  private panStart = { x: 0, y: 0 };
  /** Camera position captured when the pan began. */
  private panOrigin = { x: 0, y: 0 };

  // ---- collaborators ---------------------------------------------------
  private canvas: HTMLCanvasElement;
  private roomId: string;
  private socket: WebSocket;
  private renderer: Renderer;
  private history = new History();
  private textarea: HTMLTextAreaElement | null = null;

  constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    this.canvas = canvas;
    this.roomId = roomId;
    this.socket = socket;
    this.renderer = new Renderer(canvas, () => this.scene());

    this.bindSocket();
    this.bindMouse();
    this.bindKeys();
    void this.loadInitial();
  }

  /* ------------------------------------------------------------------ *
   * Public API used by React                                            *
   * ------------------------------------------------------------------ */

  setTool(tool: Tool): void {
    this.commitTextIfEditing();
    this.currentTool = tool;
    // Leaving a tool clears any transient selection except for Select itself.
    if (tool !== Tool.Select) this.selectedId = null;
    this.updateCursor();
    this.renderer.schedule();
  }

  setStyle(patch: Partial<ShapeStyle>): void {
    this.style = { ...this.style, ...patch };
  }

  undo(): void {
    const restored = this.history.undo(this.serializeAll());
    if (!restored) return;
    this.replaceAll(restored);
    // Sync the full new state so peers converge (clear + re-add).
    this.broadcastFullReset(restored);
    this.renderer.schedule();
  }

  redo(): void {
    const restored = this.history.redo(this.serializeAll());
    if (!restored) return;
    this.replaceAll(restored);
    this.broadcastFullReset(restored);
    this.renderer.schedule();
  }

  destroy(): void {
    this.canvas.removeEventListener("mousedown", this.onMouseDown);
    this.canvas.removeEventListener("mousemove", this.onMouseMove);
    window.removeEventListener("mouseup", this.onMouseUp);
    window.removeEventListener("keydown", this.onKeyDown);
    this.socket.onmessage = null;
    this.removeTextarea();
    this.renderer.destroy();
  }

  /* ------------------------------------------------------------------ *
   * Scene assembly for the renderer                                     *
   * ------------------------------------------------------------------ */

  private scene(): Scene {
    return {
      shapes: this.shapes,
      preview: this.preview,
      selectionBounds: this.selectionBounds(),
      camera: this.camera,
    };
  }

  /* ------------------------------------------------------------------ *
   * Camera / coordinate conversion                                      *
   *                                                                     *
   * Shapes are stored in WORLD coordinates and never mutated by panning. *
   * Mouse events arrive in SCREEN (canvas-local) pixels, so every gesture *
   * converts to world space before hit-testing or building a shape.      *
   * ------------------------------------------------------------------ */

  /** Screen (canvas-local) pixels -> world coordinates. */
  private screenToWorld(sx: number, sy: number): Point {
    return {
      x: sx / this.camera.zoom + this.camera.x,
      y: sy / this.camera.zoom + this.camera.y,
    };
  }

  /** World coordinates -> screen (canvas-local) pixels. */
  private worldToScreen(wx: number, wy: number): Point {
    return {
      x: (wx - this.camera.x) * this.camera.zoom,
      y: (wy - this.camera.y) * this.camera.zoom,
    };
  }

  private selectionBounds(): Bounds | null {
    if (!this.selectedId) return null;
    const shape = this.shapes.find((s) => s.id === this.selectedId);
    return shape ? shape.getBounds() : null;
  }

  /* ------------------------------------------------------------------ *
   * Initial load + networking                                           *
   * ------------------------------------------------------------------ */

  private async loadInitial(): Promise<void> {
    const raw = await getExistingShapes(this.roomId);
    this.shapes = raw.map(createShape).filter((s): s is Shape => s !== null);
    this.renderer.schedule();
  }

  private bindSocket(): void {
    this.socket.onmessage = (event) => {
      let message: any;
      try {
        message = JSON.parse(event.data);
      } catch {
        return;
      }
      if (message.type !== "chat") return;
      const op = decodeNetOp(message.message);
      if (op) this.applyRemoteOp(op);
    };
  }

  private applyRemoteOp(op: NetOp): void {
    switch (op.op) {
      case "add":
      case "update": {
        const shape = createShape(op.shape);
        if (!shape) return;
        const idx = this.shapes.findIndex((s) => s.id === shape.id);
        if (idx >= 0) this.shapes[idx] = shape;
        else this.shapes.push(shape);
        break;
      }
      case "delete":
        this.shapes = this.shapes.filter((s) => s.id !== op.id);
        if (this.selectedId === op.id) this.selectedId = null;
        break;
      case "clear":
        this.shapes = [];
        this.selectedId = null;
        break;
    }
    this.renderer.schedule();
  }

  private send(op: NetOp): void {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(buildFrame(this.roomId, op));
    }
  }

  /**
   * After an undo/redo the whole document changes, so we resync peers by
   * clearing and re-adding. Keeps remote clients consistent without a custom
   * "replace all" server op.
   */
  private broadcastFullReset(doc: ShapeData[]): void {
    this.send({ op: "clear" });
    for (const shape of doc) this.send({ op: "add", shape });
  }

  /* ------------------------------------------------------------------ *
   * State mutation helpers (each records history + syncs)               *
   * ------------------------------------------------------------------ */

  private serializeAll(): ShapeData[] {
    return this.shapes.map((s) => s.serialize());
  }

  private replaceAll(doc: ShapeData[]): void {
    this.shapes = doc.map(createShape).filter((s): s is Shape => s !== null);
    if (this.selectedId && !this.shapes.some((s) => s.id === this.selectedId)) {
      this.selectedId = null;
    }
  }

  private addShape(shape: Shape): void {
    this.history.commit(this.serializeAll());
    this.shapes.push(shape);
    this.send({ op: "add", shape: shape.serialize() });
    this.renderer.schedule();
  }

  private deleteShape(id: string): void {
    const exists = this.shapes.some((s) => s.id === id);
    if (!exists) return;
    this.history.commit(this.serializeAll());
    this.shapes = this.shapes.filter((s) => s.id !== id);
    if (this.selectedId === id) this.selectedId = null;
    this.send({ op: "delete", id });
    this.renderer.schedule();
  }

  /* ------------------------------------------------------------------ *
   * Mouse handling                                                      *
   * ------------------------------------------------------------------ */

  private bindMouse(): void {
    this.canvas.addEventListener("mousedown", this.onMouseDown);
    this.canvas.addEventListener("mousemove", this.onMouseMove);
    // mouseup on window so releasing outside the canvas still ends the drag.
    window.addEventListener("mouseup", this.onMouseUp);
  }

  /** Convert a DOM event to canvas-local coordinates. */
  private toCanvasPoint(e: MouseEvent): { x: number; y: number } {
    const rect = this.canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  private onMouseDown = (e: MouseEvent): void => {
    const screen = this.toCanvasPoint(e);

    // Panning takes priority over any tool: middle-mouse drag, or Space + left
    // drag. We store the screen anchor + camera origin and convert deltas to
    // world units on move. The camera moves; shapes never do.
    if (e.button === 1 || (e.button === 0 && this.spaceDown)) {
      e.preventDefault();
      this.beginPan(screen.x, screen.y);
      return;
    }

    const { x, y } = this.screenToWorld(screen.x, screen.y);
    this.mouse = { down: true, startX: x, startY: y, lastX: x, lastY: y };
    this.movedDuringDrag = false;

    switch (this.currentTool) {
      case Tool.Text:
        // Text is a click action, not a drag — end the gesture immediately so a
        // stray mousemove can't start drawing. preventDefault stops the canvas
        // from stealing focus from the textarea we're about to open.
        this.mouse.down = false;
        e.preventDefault();
        this.openTextEditor(x, y);
        return;
      case Tool.Select:
        this.selectAt(x, y);
        return;
      case Tool.Eraser:
        this.eraseAt(x, y);
        return;
      case Tool.Pencil:
        this.freePoints = [{ x, y }];
        return;
      default:
        // Drawing tools build their preview on move; nothing to do yet.
        return;
    }
  };

  private onMouseMove = (e: MouseEvent): void => {
    const screen = this.toCanvasPoint(e);

    // A pan in progress consumes the move; tools are inactive while panning.
    if (this.panning) {
      this.updatePan(screen.x, screen.y);
      return;
    }

    const { x, y } = this.screenToWorld(screen.x, screen.y);
    if (!this.mouse.down) return;
    this.movedDuringDrag = true;

    switch (this.currentTool) {
      case Tool.Select:
        this.dragSelection(x - this.mouse.lastX, y - this.mouse.lastY);
        break;
      case Tool.Eraser:
        this.eraseAt(x, y);
        break;
      case Tool.Pencil:
        this.freePoints.push({ x, y });
        this.preview = this.buildShape(Tool.Pencil, this.mouse.startX, this.mouse.startY, x, y);
        this.renderer.schedule();
        break;
      default:
        this.preview = this.buildShape(this.currentTool, this.mouse.startX, this.mouse.startY, x, y);
        this.renderer.schedule();
        break;
    }
    this.mouse.lastX = x;
    this.mouse.lastY = y;
  };

  private onMouseUp = (e: MouseEvent): void => {
    // End a pan gesture if one was active (independent of any tool drag).
    if (this.panning) {
      this.endPan();
      return;
    }

    if (!this.mouse.down) return;
    const screen = this.toCanvasPoint(e);
    const { x, y } = this.screenToWorld(screen.x, screen.y);
    this.mouse.down = false;

    if (this.currentTool === Tool.Select) {
      this.endSelectionDrag();
      return;
    }

    if (this.isDrawingTool(this.currentTool)) {
      const shape =
        this.currentTool === Tool.Pencil
          ? this.buildShape(Tool.Pencil, this.mouse.startX, this.mouse.startY, x, y)
          : this.buildShape(this.currentTool, this.mouse.startX, this.mouse.startY, x, y);
      this.preview = null;
      this.freePoints = [];
      if (shape && this.isMeaningful(shape)) {
        this.addShape(shape);
      } else {
        this.renderer.schedule();
      }
    }
  };

  private isDrawingTool(tool: Tool): boolean {
    return (
      tool === Tool.Rectangle ||
      tool === Tool.Circle ||
      tool === Tool.Line ||
      tool === Tool.Arrow ||
      tool === Tool.Triangle ||
      tool === Tool.Diamond ||
      tool === Tool.Pencil
    );
  }

  /** Reject zero-size accidental shapes (a click without a drag). */
  private isMeaningful(shape: Shape): boolean {
    if (shape.type === "freestroke") return true;
    const b = shape.getBounds();
    return b.width > 2 || b.height > 2;
  }

  /* ------------------------------------------------------------------ *
   * Panning (camera movement — never touches shape coordinates)         *
   * ------------------------------------------------------------------ */

  private beginPan(screenX: number, screenY: number): void {
    this.panning = true;
    this.panStart = { x: screenX, y: screenY };
    this.panOrigin = { x: this.camera.x, y: this.camera.y };
    // Any half-started tool drag is abandoned the moment a pan begins.
    this.mouse.down = false;
    this.preview = null;
    this.canvas.style.cursor = "grabbing";
  }

  private updatePan(screenX: number, screenY: number): void {
    // A screen delta of N pixels moves the world by N / zoom world units. We
    // SUBTRACT because dragging the content right means the camera (the window)
    // moves left.
    const dx = (screenX - this.panStart.x) / this.camera.zoom;
    const dy = (screenY - this.panStart.y) / this.camera.zoom;
    this.camera.x = this.panOrigin.x - dx;
    this.camera.y = this.panOrigin.y - dy;
    this.renderer.schedule();
  }

  private endPan(): void {
    this.panning = false;
    this.updateCursor();
  }

  /* ------------------------------------------------------------------ *
   * Selection                                                           *
   * ------------------------------------------------------------------ */

  private selectAt(x: number, y: number): void {
    // Topmost shape wins (iterate from the end).
    for (let i = this.shapes.length - 1; i >= 0; i--) {
      if (this.shapes[i]!.contains(x, y)) {
        this.selectedId = this.shapes[i]!.id;
        this.renderer.schedule();
        return;
      }
    }
    this.selectedId = null;
    this.renderer.schedule();
  }

  private dragSelection(dx: number, dy: number): void {
    if (!this.selectedId) return;
    const shape = this.shapes.find((s) => s.id === this.selectedId);
    if (!shape) return;
    // Snapshot history once, at the start of a move gesture.
    if (this.movedDuringDrag && !this.moveCommitted) {
      this.history.commit(this.serializeAll());
      this.moveCommitted = true;
    }
    shape.move(dx, dy);
    this.renderer.schedule();
  }

  private moveCommitted = false;

  private endSelectionDrag(): void {
    if (this.selectedId && this.moveCommitted) {
      const shape = this.shapes.find((s) => s.id === this.selectedId);
      if (shape) this.send({ op: "update", shape: shape.serialize() });
    }
    this.moveCommitted = false;
  }

  /* ------------------------------------------------------------------ *
   * Eraser                                                              *
   * ------------------------------------------------------------------ */

  private eraseAt(x: number, y: number): void {
    for (let i = this.shapes.length - 1; i >= 0; i--) {
      if (this.shapes[i]!.contains(x, y)) {
        this.deleteShape(this.shapes[i]!.id);
        return;
      }
    }
  }

  /* ------------------------------------------------------------------ *
   * Text overlay                                                        *
   * ------------------------------------------------------------------ */

  private openTextEditor(x: number, y: number): void {
    this.commitTextIfEditing();
    const rect = this.canvas.getBoundingClientRect();
    const ta = document.createElement("textarea");
    ta.style.position = "fixed";
    ta.style.left = `${rect.left + x}px`;
    ta.style.top = `${rect.top + y}px`;
    // The canvas wrapper sets `isolation: isolate` + `zIndex: 20`, creating a
    // stacking context. This textarea is appended to <body>, so it competes at
    // body level — use the max z-index so it always sits above the canvas and
    // toolbar regardless of their internal stacking.
    ta.style.zIndex = "2147483647";
    ta.style.background = "transparent";
    ta.style.color = this.style.stroke;
    ta.style.caretColor = this.style.stroke;
    ta.style.border = "1px dashed #4f8cff";
    ta.style.outline = "none";
    // Match the rendered TextShape exactly so the committed text lands where it
    // was typed (same font + line-height; zero padding/border-box offset).
    ta.style.font = "20px sans-serif";
    ta.style.lineHeight = "1.2";
    ta.style.boxSizing = "border-box";
    ta.style.padding = "0";
    ta.style.margin = "0";
    ta.style.resize = "none";
    ta.style.overflow = "hidden";
    ta.style.whiteSpace = "pre";
    ta.style.height = `${20 * 1.2 + 2}px`;
    ta.style.minWidth = "60px";
    ta.rows = 1;
    ta.dataset.x = String(x);
    ta.dataset.y = String(y);

    // Auto-grow height as the user adds lines so multi-line text is visible.
    ta.addEventListener("input", () => {
      ta.style.height = "auto";
      ta.style.height = `${ta.scrollHeight}px`;
    });

    ta.addEventListener("keydown", (ev) => {
      ev.stopPropagation();
      if (ev.key === "Escape") {
        this.removeTextarea();
      }
    });

    document.body.appendChild(ta);
    this.textarea = ta;

    // Focus on the next frame so it wins against the browser's default
    // focus handling from the originating mousedown. Only after it has
    // genuinely received focus do we attach the blur->commit handler, so the
    // initial (spurious) blur during the same click can't destroy it.
    requestAnimationFrame(() => {
      ta.focus();
      ta.addEventListener("blur", () => this.commitTextIfEditing());
    });
  }

  private commitTextIfEditing(): void {
    const ta = this.textarea;
    if (!ta) return;
    // Detach reference + node FIRST. Removing a focused textarea fires `blur`,
    // which re-enters commitTextIfEditing — clearing this.textarea up front
    // makes that re-entry a no-op, preventing the double-remove crash.
    this.textarea = null;
    const value = ta.value;
    const x = Number(ta.dataset.x);
    const y = Number(ta.dataset.y);
    ta.remove();

    if (value.trim().length === 0) return;
    const shape = createShape({
      id: createId(),
      type: "text",
      x,
      y,
      text: value,
      fontSize: 20,
      style: { ...this.style },
    });
    if (shape) this.addShape(shape);
  }

  private removeTextarea(): void {
    const ta = this.textarea;
    if (!ta) return;
    this.textarea = null;
    ta.remove();
  }

  /* ------------------------------------------------------------------ *
   * Keyboard (undo/redo + delete)                                       *
   * ------------------------------------------------------------------ */

  private bindKeys(): void {
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
  }

  private onKeyDown = (e: KeyboardEvent): void => {
    // Don't hijack typing inside the text overlay.
    if (this.textarea && document.activeElement === this.textarea) return;

    // Space arms left-drag panning. preventDefault stops the page from
    // scrolling. Show the open-hand cursor as an affordance until the drag.
    if (e.code === "Space" && !this.spaceDown) {
      e.preventDefault();
      this.spaceDown = true;
      if (!this.panning) this.canvas.style.cursor = "grab";
      return;
    }

    const mod = e.ctrlKey || e.metaKey;
    if (mod && e.key.toLowerCase() === "z") {
      e.preventDefault();
      if (e.shiftKey) this.redo();
      else this.undo();
    } else if (mod && e.key.toLowerCase() === "y") {
      e.preventDefault();
      this.redo();
    } else if ((e.key === "Delete" || e.key === "Backspace") && this.selectedId) {
      e.preventDefault();
      this.deleteShape(this.selectedId);
    }
  };

  private onKeyUp = (e: KeyboardEvent): void => {
    if (e.code === "Space") {
      this.spaceDown = false;
      // Restore the tool cursor unless a pan drag is still in flight.
      if (!this.panning) this.updateCursor();
    }
  };

  /* ------------------------------------------------------------------ *
   * Shape construction (maps a tool + drag box to a Shape instance)     *
   * ------------------------------------------------------------------ */

  private buildShape(tool: Tool, x1: number, y1: number, x2: number, y2: number): Shape | null {
    const id = createId();
    const style = { ...this.style };
    const box = normalizeBox(x1, y1, x2, y2);

    switch (tool) {
      case Tool.Rectangle:
        return createShape({ id, type: "rectangle", ...box, style });
      case Tool.Circle:
        return createShape({
          id,
          type: "circle",
          centerX: box.x + box.width / 2,
          centerY: box.y + box.height / 2,
          radiusX: box.width / 2,
          radiusY: box.height / 2,
          style,
        });
      case Tool.Line:
        return createShape({ id, type: "line", x1, y1, x2, y2, style });
      case Tool.Arrow:
        return createShape({ id, type: "arrow", x1, y1, x2, y2, style });
      case Tool.Triangle:
        return createShape({ id, type: "triangle", ...box, style });
      case Tool.Diamond:
        return createShape({ id, type: "diamond", ...box, style });
      case Tool.Pencil:
        return createShape({ id, type: "freestroke", points: this.freePoints.slice(), style });
      default:
        return null;
    }
  }

  /* ------------------------------------------------------------------ *
   * Cursor feedback                                                     *
   * ------------------------------------------------------------------ */

  private updateCursor(): void {
    if (this.currentTool === Tool.Select) this.canvas.style.cursor = "default";
    else if (this.currentTool === Tool.Text) this.canvas.style.cursor = "text";
    else if (this.currentTool === Tool.Eraser) this.canvas.style.cursor = "cell";
    else this.canvas.style.cursor = "crosshair";
  }
}
