"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Copy, X } from "lucide-react";
import { cssVar } from "@repo/ui/tokens";

/**
 * ShareRoomModal — a polished, accessible dialog for sharing a room.
 *
 * Behavior (matches the spec):
 *   - Opening does NOT copy anything; the user copies explicitly.
 *   - Two read-only, easily-selectable fields — the full share link and the
 *     room code — each with its own Copy button that copies ONLY that value.
 *   - Copying shows a success toast; the modal does NOT auto-close on copy.
 *   - Closes on the Close button, a click on the backdrop, or Escape.
 *
 * It is presentational: the parent supplies `shareUrl` and `roomCode`, so this
 * component has no knowledge of routing or the room model.
 */
export interface ShareRoomModalProps {
  open: boolean;
  onClose: () => void;
  shareUrl: string;
  roomCode: string;
}

export function ShareRoomModal({
  open,
  onClose,
  shareUrl,
  roomCode,
}: ShareRoomModalProps) {
  const reduce = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close on Escape while open. Bound at the document level so it works no
  // matter where focus currently sits.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  // Move focus into the dialog when it opens (accessibility).
  useEffect(() => {
    if (open) dialogRef.current?.focus();
  }, [open]);

  // Clean up a pending toast timer on unmount.
  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const showToast = (message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  };

  const handleCopy = async (value: string, successMessage: string) => {
    const copied = await copyText(value);
    showToast(copied ? successMessage : "Couldn't copy — select and copy manually.");
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          // Backdrop — clicking it (but not the dialog) closes the modal.
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 2147483000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            background: "color-mix(in srgb, #000 62%, transparent)",
            backdropFilter: "blur(4px)",
          }}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-room-title"
            tabIndex={-1}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 260, damping: 24, mass: 0.9 }}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: 460,
              background: cssVar.color.bgElevated,
              border: `1px solid ${cssVar.color.border}`,
              borderRadius: 18,
              boxShadow: cssVar.shadow.lg,
              padding: "26px 26px 22px",
              outline: "none",
            }}
          >
            {/* Close (X) button */}
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              style={closeIconStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = cssVar.color.textPrimary;
                e.currentTarget.style.background = cssVar.color.bgOverlay;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = cssVar.color.textMuted;
                e.currentTarget.style.background = "transparent";
              }}
            >
              <X size={18} />
            </button>

            <h2
              id="share-room-title"
              style={{
                fontSize: 20,
                fontWeight: 800,
                letterSpacing: "-0.02em",
                textAlign: "center",
                color: cssVar.color.textPrimary,
                margin: "2px 0 22px",
              }}
            >
              Share Room
            </h2>

            <CopyField
              label="Shareable Link"
              value={shareUrl}
              onCopy={() => handleCopy(shareUrl, "Share link copied!")}
            />

            <div style={{ height: 16 }} />

            <CopyField
              label="Room Code"
              value={roomCode}
              onCopy={() => handleCopy(roomCode, "Room code copied!")}
              mono
            />

            <p
              style={{
                fontSize: 12.5,
                lineHeight: 1.6,
                color: cssVar.color.textMuted,
                textAlign: "center",
                margin: "20px 0 18px",
              }}
            >
              Anyone with this link can join this room after signing in.
            </p>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <button
                type="button"
                onClick={onClose}
                style={closeButtonStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = cssVar.color.borderHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = cssVar.color.bgOverlay;
                }}
              >
                Close
              </button>
            </div>

            {/* Success toast — lives inside the dialog, above the footer. */}
            <AnimatePresence>
              {toast && (
                <motion.div
                  role="status"
                  aria-live="polite"
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.18 }}
                  style={{
                    position: "absolute",
                    left: "50%",
                    bottom: -14,
                    transform: "translateX(-50%)",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    whiteSpace: "nowrap",
                    padding: "9px 14px",
                    borderRadius: 999,
                    background: cssVar.color.bgOverlay,
                    border: `1px solid color-mix(in srgb, ${cssVar.color.success} 45%, transparent)`,
                    boxShadow: cssVar.shadow.md,
                    fontSize: 13,
                    fontWeight: 600,
                    color: cssVar.color.textPrimary,
                  }}
                >
                  <Check size={15} color={cssVar.color.success} />
                  {toast}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────
   CopyField — a labelled, read-only value with a trailing Copy button.
   The value is selectable and the input is readOnly (never editable).
───────────────────────────────────────── */
function CopyField({
  label,
  value,
  onCopy,
  mono = false,
}: {
  label: string;
  value: string;
  onCopy: () => void;
  mono?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: 12.5,
          fontWeight: 600,
          color: cssVar.color.textSecondary,
          margin: "0 0 8px",
        }}
      >
        {label}
      </label>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          ref={inputRef}
          readOnly
          value={value}
          onFocus={(e) => e.currentTarget.select()}
          // Select-all on click makes the value trivially copyable by hand too.
          onClick={(e) => e.currentTarget.select()}
          style={{
            flex: 1,
            minWidth: 0,
            height: 42,
            padding: "0 12px",
            borderRadius: 10,
            border: `1px solid ${cssVar.color.border}`,
            background: cssVar.color.bgBase,
            color: cssVar.color.textPrimary,
            fontSize: 13.5,
            fontFamily: mono ? cssVar.font.mono : cssVar.font.sans,
            letterSpacing: mono ? "0.02em" : undefined,
            outline: "none",
            textOverflow: "ellipsis",
          }}
        />
        <button
          type="button"
          onClick={onCopy}
          aria-label={`Copy ${label.toLowerCase()}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            height: 42,
            padding: "0 14px",
            borderRadius: 10,
            border: "none",
            cursor: "pointer",
            background: cssVar.color.honey500,
            color: cssVar.color.textOnBrand,
            fontSize: 13,
            fontWeight: 700,
            whiteSpace: "nowrap",
            transition: `filter ${cssVar.duration.base}`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.filter = "brightness(1.08)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = "none";
          }}
        >
          <Copy size={15} />
          Copy
        </button>
      </div>
    </div>
  );
}

const closeIconStyle: React.CSSProperties = {
  position: "absolute",
  top: 14,
  right: 14,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 32,
  height: 32,
  borderRadius: 8,
  border: "none",
  background: "transparent",
  color: cssVar.color.textMuted,
  cursor: "pointer",
  transition: `background ${cssVar.duration.base}, color ${cssVar.duration.base}`,
};

const closeButtonStyle: React.CSSProperties = {
  height: 40,
  padding: "0 26px",
  borderRadius: 10,
  border: `1px solid ${cssVar.color.border}`,
  background: cssVar.color.bgOverlay,
  color: cssVar.color.textPrimary,
  fontSize: 13.5,
  fontWeight: 600,
  cursor: "pointer",
  transition: `background ${cssVar.duration.base}`,
};

/**
 * Copy text to the clipboard, with a resilient fallback for non-secure contexts
 * (the Clipboard API requires HTTPS or localhost). Returns whether it succeeded.
 */
async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to the legacy path
  }

  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}
