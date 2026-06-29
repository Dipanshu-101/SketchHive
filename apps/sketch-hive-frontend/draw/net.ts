/**
 * Collaboration wire-format.
 *
 * We keep the EXISTING transport envelope the backend already understands:
 *
 *     { type: "chat", roomId, message: "<json string>" }
 *
 * ...and put a richer, versioned operation inside `message`. This means we did
 * not have to invent a new socket message type — the server still routes and
 * persists "chat" messages — while gaining live sync for edits and deletes.
 *
 * Backward compatibility: the OLD engine sent `message = JSON.stringify({shape})`
 * with no `op`. decodeNetOp() treats a payload that has a `shape` but no `op`
 * as an "add", so historical rooms keep working.
 */
import type { ShapeData } from "./types";

export const PROTOCOL_VERSION = 2;

export type NetOp =
  | { op: "add"; shape: ShapeData }
  | { op: "update"; shape: ShapeData }
  | { op: "delete"; id: string }
  | { op: "clear" };

/** Serialize an op into the string carried by the `chat` envelope's `message`. */
export function encodeNetOp(op: NetOp): string {
  return JSON.stringify({ v: PROTOCOL_VERSION, ...op });
}

/** Parse the `message` string from an incoming chat event into a NetOp. */
export function decodeNetOp(message: string): NetOp | null {
  let parsed: any;
  try {
    parsed = JSON.parse(message);
  } catch {
    return null;
  }
  if (!parsed || typeof parsed !== "object") return null;

  // Legacy add: `{ shape }` with no explicit op.
  if (!parsed.op && parsed.shape) {
    return { op: "add", shape: parsed.shape };
  }

  switch (parsed.op) {
    case "add":
    case "update":
      return parsed.shape ? { op: parsed.op, shape: parsed.shape } : null;
    case "delete":
      return typeof parsed.id === "string" ? { op: "delete", id: parsed.id } : null;
    case "clear":
      return { op: "clear" };
    default:
      return null;
  }
}

/** Build the full socket frame to send over the wire. */
export function buildFrame(roomId: string, op: NetOp): string {
  return JSON.stringify({
    type: "chat",
    roomId,
    message: encodeNetOp(op),
  });
}
