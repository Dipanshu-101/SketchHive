"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { ChatConnectionState } from "../types";

/** Maps a WebSocket's readyState (or its absence) to our connection enum. */
function read(socket: WebSocket | null): ChatConnectionState {
  if (!socket) return "connecting";
  switch (socket.readyState) {
    case WebSocket.OPEN:
      return "connected";
    case WebSocket.CONNECTING:
      return "connecting";
    default:
      return "disconnected";
  }
}

/**
 * Tracks the live connection state of the shared socket.
 *
 * The socket is an EXTERNAL mutable source, so the idiomatic React 19 way to
 * read it is useSyncExternalStore rather than mirroring readyState into local
 * state via an effect. subscribe wires the open/close/error listeners;
 * getSnapshot reports the current readyState; getServerSnapshot keeps SSR happy.
 */
export function useConnectionState(socket: WebSocket | null): ChatConnectionState {
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (!socket) return () => {};
      socket.addEventListener("open", onChange);
      socket.addEventListener("close", onChange);
      socket.addEventListener("error", onChange);
      return () => {
        socket.removeEventListener("open", onChange);
        socket.removeEventListener("close", onChange);
        socket.removeEventListener("error", onChange);
      };
    },
    [socket]
  );

  const getSnapshot = useCallback(() => read(socket), [socket]);
  const getServerSnapshot = useCallback((): ChatConnectionState => "connecting", []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
