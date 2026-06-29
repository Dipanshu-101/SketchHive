/**
 * The ONE place in the engine that maps a shape's `type` string to a concrete
 * class. Everything else is polymorphic. To add a new shape you add one case
 * here (plus the new class, its data interface, a Tool enum entry and a toolbar
 * button) — nothing else changes.
 *
 * `createShape` also tolerates LEGACY data persisted by the old engine so old
 * rooms keep rendering: missing ids are generated, the old circle format
 * (centerX/centerY/radius) is upgraded, and missing styles get a default.
 */
import { Shape } from "./Shape";
import { Rectangle } from "./Rectangle";
import { Circle } from "./Circle";
import { Line } from "./Line";
import { Arrow } from "./Arrow";
import { Triangle } from "./Triangle";
import { Diamond } from "./Diamond";
import { TextShape } from "./TextShape";
import { FreeStroke } from "./FreeStroke";
import { createId } from "../geometry";
import type { ShapeData, ShapeStyle } from "../types";

export const DEFAULT_STYLE: ShapeStyle = {
  stroke: "#ffffff",
  lineWidth: 2,
  fill: "transparent",
};

/** Coerce arbitrary stored JSON into a normalized ShapeData, or return null. */
function normalize(raw: any): ShapeData | null {
  if (!raw || typeof raw !== "object") return null;

  const id: string = typeof raw.id === "string" ? raw.id : createId();
  const style: ShapeStyle = {
    stroke: raw.style?.stroke ?? DEFAULT_STYLE.stroke,
    lineWidth: raw.style?.lineWidth ?? DEFAULT_STYLE.lineWidth,
    fill: raw.style?.fill ?? DEFAULT_STYLE.fill,
  };

  switch (raw.type) {
    case "rectangle":
    case "rect": // legacy alias
      return { id, style, type: "rectangle", x: raw.x, y: raw.y, width: raw.width, height: raw.height };

    case "circle":
      // Legacy circles stored a single `radius`; upgrade to rx/ry.
      return {
        id,
        style,
        type: "circle",
        centerX: raw.centerX,
        centerY: raw.centerY,
        radiusX: raw.radiusX ?? raw.radius ?? 0,
        radiusY: raw.radiusY ?? raw.radius ?? 0,
      };

    case "line":
      return { id, style, type: "line", x1: raw.x1, y1: raw.y1, x2: raw.x2, y2: raw.y2 };

    case "arrow":
      return { id, style, type: "arrow", x1: raw.x1, y1: raw.y1, x2: raw.x2, y2: raw.y2 };

    case "triangle":
      return { id, style, type: "triangle", x: raw.x, y: raw.y, width: raw.width, height: raw.height };

    case "diamond":
      return { id, style, type: "diamond", x: raw.x, y: raw.y, width: raw.width, height: raw.height };

    case "text":
      return { id, style, type: "text", x: raw.x, y: raw.y, text: raw.text ?? "", fontSize: raw.fontSize ?? 20 };

    case "freestroke":
    case "pencil": // legacy alias
      return {
        id,
        style,
        type: "freestroke",
        points: Array.isArray(raw.points)
          ? raw.points
          : // very old 2-point "pencil" shape
            [
              { x: raw.startX, y: raw.startY },
              { x: raw.endX, y: raw.endY },
            ],
      };

    default:
      return null;
  }
}

/** Build a live Shape instance from a (possibly legacy) data object. */
export function createShape(raw: any): Shape | null {
  const data = normalize(raw);
  if (!data) return null;

  switch (data.type) {
    case "rectangle":
      return new Rectangle(data);
    case "circle":
      return new Circle(data);
    case "line":
      return new Line(data);
    case "arrow":
      return new Arrow(data);
    case "triangle":
      return new Triangle(data);
    case "diamond":
      return new Diamond(data);
    case "text":
      return new TextShape(data);
    case "freestroke":
      return new FreeStroke(data);
    default:
      return null;
  }
}
