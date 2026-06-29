/**
 * Core type definitions for the SketchHive drawing engine.
 *
 * These types are the single source of truth shared by every layer of the
 * engine: the tool system, the shape classes, the renderer, the history stack
 * and the collaboration (WebSocket) layer.
 *
 * Design note: we separate "Shape" (a live class instance that knows how to
 * draw and hit-test itself) from "ShapeData" (a plain, serializable, immutable
 * snapshot of that shape). ShapeData is what travels over the network and what
 * gets stored in the undo/redo history. Shape classes are reconstructed from
 * ShapeData via the factory. This split keeps networking + history trivially
 * (de)serializable while letting the shapes carry rich behaviour.
 */

/** The active drawing tool. Toolbar buttons simply switch this value. */
export enum Tool {
  Select = "select",
  Rectangle = "rectangle",
  Circle = "circle",
  Line = "line",
  Arrow = "arrow",
  Triangle = "triangle",
  Diamond = "diamond",
  Pencil = "pencil",
  Text = "text",
  Eraser = "eraser",
}

/** Discriminator stored inside every persisted shape. */
export type ShapeType =
  | "rectangle"
  | "circle"
  | "line"
  | "arrow"
  | "triangle"
  | "diamond"
  | "text"
  | "freestroke";

export interface Point {
  x: number;
  y: number;
}

/**
 * The viewport's window onto the infinite world plane.
 *
 *   - `x`/`y` are the WORLD coordinates that sit at the top-left of the screen.
 *   - `zoom` scales world units to screen pixels.
 *
 * Conversions (kept consistent everywhere):
 *   screenX = (worldX - camera.x) * zoom
 *   worldX  = screenX / zoom + camera.x
 *
 * `zoom` is wired through every calculation but currently fixed to 1, so a real
 * zoom feature is a single value change away — no formula needs to be rewritten.
 */
export interface Camera {
  x: number;
  y: number;
  zoom: number;
}

/** Axis-aligned bounding box, used for selection + eraser hit-testing. */
export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Common visual styling every shape understands. */
export interface ShapeStyle {
  stroke: string;
  /** Line width in pixels. */
  lineWidth: number;
  /** Optional fill colour. Omitted / "transparent" means no fill. */
  fill?: string;
}

/** Properties shared by every serialized shape. */
interface BaseShapeData {
  id: string;
  style: ShapeStyle;
}

/* ------------------------------------------------------------------ *
 * One data interface per shape. Each tool defines ONLY the geometry   *
 * properties it actually needs — there is no god-object.              *
 * ------------------------------------------------------------------ */

export interface RectangleData extends BaseShapeData {
  type: "rectangle";
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CircleData extends BaseShapeData {
  type: "circle";
  centerX: number;
  centerY: number;
  radiusX: number;
  radiusY: number;
}

export interface LineData extends BaseShapeData {
  type: "line";
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface ArrowData extends BaseShapeData {
  type: "arrow";
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface TriangleData extends BaseShapeData {
  type: "triangle";
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DiamondData extends BaseShapeData {
  type: "diamond";
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TextData extends BaseShapeData {
  type: "text";
  x: number;
  y: number;
  text: string;
  fontSize: number;
}

export interface FreeStrokeData extends BaseShapeData {
  type: "freestroke";
  points: Point[];
}

/** Discriminated union of every persisted shape. */
export type ShapeData =
  | RectangleData
  | CircleData
  | LineData
  | ArrowData
  | TriangleData
  | DiamondData
  | TextData
  | FreeStrokeData;
