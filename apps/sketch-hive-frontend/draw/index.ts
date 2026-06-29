/**
 * Public entry point for the drawing engine.
 *
 * The old free-function `initDraw` implementation has been removed — all drawing
 * logic now lives in the `Game` controller and the shape system. Import from
 * here to use the engine.
 */
export { Game } from "./Game";
export { Tool } from "./types";
export type { ShapeData, ShapeStyle, Point, Bounds } from "./types";
