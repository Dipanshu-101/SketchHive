/**
 * Undo / Redo via immutable snapshots.
 *
 * The engine treats the whole document (an array of ShapeData) as a value.
 * Every committed change pushes a *deep copy* of the previous document onto the
 * `history` stack and clears the `future` (redo) stack. Undo moves the current
 * state to `future` and restores the top of `history`; redo does the reverse.
 *
 * We snapshot plain ShapeData (not live Shape instances) so snapshots are cheap
 * to copy and never accidentally share mutable references with the live scene.
 */
import type { ShapeData } from "./types";

function clone(doc: ShapeData[]): ShapeData[] {
  // structuredClone is available in all modern browsers; JSON fallback keeps
  // things safe in odd runtimes.
  if (typeof structuredClone === "function") return structuredClone(doc);
  return JSON.parse(JSON.stringify(doc));
}

export class History {
  private past: ShapeData[][] = [];
  private futureStack: ShapeData[][] = [];
  private readonly limit: number;

  constructor(limit = 200) {
    this.limit = limit;
  }

  /** Record the state that existed BEFORE a change is applied. */
  commit(previous: ShapeData[]): void {
    this.past.push(clone(previous));
    if (this.past.length > this.limit) this.past.shift();
    // Any new action invalidates the redo branch.
    this.futureStack = [];
  }

  canUndo(): boolean {
    return this.past.length > 0;
  }

  canRedo(): boolean {
    return this.futureStack.length > 0;
  }

  /** Returns the document to restore, or null if nothing to undo. */
  undo(current: ShapeData[]): ShapeData[] | null {
    const previous = this.past.pop();
    if (!previous) return null;
    this.futureStack.push(clone(current));
    return previous;
  }

  /** Returns the document to restore, or null if nothing to redo. */
  redo(current: ShapeData[]): ShapeData[] | null {
    const next = this.futureStack.pop();
    if (!next) return null;
    this.past.push(clone(current));
    return next;
  }

  clear(): void {
    this.past = [];
    this.futureStack = [];
  }
}
