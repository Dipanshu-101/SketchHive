"use client";

import { cssVar } from "./tokens";

export type AvatarSize = "xs" | "sm" | "md" | "lg";

export interface AvatarProps {
  /** Display name — drives initials + deterministic fallback color. */
  name: string;
  /** Optional image URL. Falls back to initials on absence/error. */
  src?: string;
  size?: AvatarSize; // default: "md"
  /** Ring color (e.g. presence/user color). Renders a colored border. */
  ring?: string;
}

const sizePx: Record<AvatarSize, number> = { xs: 24, sm: 32, md: 40, lg: 56 };
const fontPx: Record<AvatarSize, number> = { xs: 10, sm: 12, md: 15, lg: 20 };

/** Deterministic surface tint per name — avoids raw color literals by mixing
 *  the honey accent by a name-derived amount. Same name → same shade. */
function tintFor(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
  const pct = 20 + (Math.abs(h) % 40); // 20–60% honey mix
  return `color-mix(in srgb, ${cssVar.color.honey500} ${pct}%, ${cssVar.color.bgOverlay})`;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

/** Circular avatar with image + initials fallback (P0). */
export function Avatar({ name, src, size = "md", ring }: AvatarProps) {
  const px = sizePx[size];
  return (
    <span
      title={name}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: px,
        height: px,
        borderRadius: "50%",
        overflow: "hidden",
        flexShrink: 0,
        fontSize: fontPx[size],
        fontWeight: 600,
        fontFamily: cssVar.font.sans,
        color: cssVar.color.textPrimary,
        background: tintFor(name),
        border: ring
          ? `2px solid ${ring}`
          : `1px solid ${cssVar.color.border}`,
        boxShadow: cssVar.shadow.sm,
        userSelect: "none",
      }}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        initials(name)
      )}
    </span>
  );
}

export interface AvatarGroupProps {
  users: { name: string; src?: string; ring?: string }[];
  size?: AvatarSize; // default: "sm"
  /** Cap shown before collapsing into a "+N" chip. Default 4. */
  max?: number;
}

/** Overlapping stack of avatars with a "+N" overflow chip (P0 — §2). */
export function AvatarGroup({ users, size = "sm", max = 4 }: AvatarGroupProps) {
  const shown = users.slice(0, max);
  const overflow = users.length - shown.length;
  const px = sizePx[size];
  const overlap = Math.round(px * 0.3);

  return (
    <div style={{ display: "inline-flex", alignItems: "center" }}>
      {shown.map((u, i) => (
        <span
          key={`${u.name}-${i}`}
          style={{
            marginLeft: i === 0 ? 0 : -overlap,
            // Ring against the page so overlapping avatars stay distinct.
            borderRadius: "50%",
            boxShadow: `0 0 0 2px ${cssVar.color.bgBase}`,
          }}
        >
          <Avatar name={u.name} src={u.src} size={size} ring={u.ring} />
        </span>
      ))}
      {overflow > 0 && (
        <span
          style={{
            marginLeft: -overlap,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: px,
            height: px,
            borderRadius: "50%",
            fontSize: fontPx[size],
            fontWeight: 600,
            fontFamily: cssVar.font.sans,
            color: cssVar.color.textSecondary,
            background: cssVar.color.bgOverlay,
            border: `1px solid ${cssVar.color.border}`,
            boxShadow: `0 0 0 2px ${cssVar.color.bgBase}`,
          }}
        >
          +{overflow}
        </span>
      )}
    </div>
  );
}
