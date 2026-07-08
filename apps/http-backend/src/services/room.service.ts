/**
 * room.service — all room business logic, independent of Express.
 *
 * A room has two identifiers with distinct roles (kept from the existing model):
 *   - `id`   (int)    — the canonical id the canvas + ws-backend consume.
 *   - `slug` (string) — the human-friendly "room code", unique, derived from the
 *                       room name. This is what users share/type; it is resolved
 *                       back to an `id` before anyone joins.
 *
 * Exposing both a slug-lookup and an id-lookup lets the frontend:
 *   - open a share link by id (direct join), and
 *   - join by room code (slug) after resolving it to an id.
 */
import { prisma } from "../prisma";
import { badRequest, notFound } from "./http-error";

/** The public shape returned to clients — never leaks internal-only fields. */
export interface RoomDTO {
  id: number;
  slug: string;
  adminId: string;
  createdAt: string;
}

function toDTO(room: {
  id: number;
  slug: string;
  adminId: string;
  createdAt: Date;
}): RoomDTO {
  return {
    id: room.id,
    slug: room.slug,
    adminId: room.adminId,
    createdAt: room.createdAt.toISOString(),
  };
}

/**
 * Turn a room name into a URL/code-safe slug: lowercase, spaces→hyphens,
 * stripped of anything that isn't a-z/0-9/hyphen, collapsed and trimmed.
 * Guards against a name that reduces to an empty slug.
 */
function slugify(name: string): string {
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  if (!slug) {
    throw badRequest("Room name must contain letters or numbers");
  }
  return slug;
}

/**
 * Create a room owned by `adminId`. Throws 409 (via the unique constraint being
 * pre-checked) if the derived slug already exists, so two rooms never collide on
 * a share code.
 */
export async function createRoom(
  name: string,
  adminId: string,
): Promise<RoomDTO> {
  const slug = slugify(name);

  const existing = await prisma.room.findUnique({ where: { slug } });
  if (existing) {
    throw badRequest("A room with a similar name already exists");
  }

  const room = await prisma.room.create({
    data: { slug, adminId },
  });
  return toDTO(room);
}

/** Resolve a room by its numeric id. Throws 404 if it doesn't exist. */
export async function getRoomById(id: number): Promise<RoomDTO> {
  if (!Number.isInteger(id)) {
    throw badRequest("Invalid room id");
  }
  const room = await prisma.room.findUnique({ where: { id } });
  if (!room) {
    throw notFound("Room not found");
  }
  return toDTO(room);
}

/** Resolve a room by its slug (room code). Throws 404 if it doesn't exist. */
export async function getRoomBySlug(slug: string): Promise<RoomDTO> {
  const normalized = slug.trim().toLowerCase();
  if (!normalized) {
    throw badRequest("Invalid room code");
  }
  const room = await prisma.room.findUnique({ where: { slug: normalized } });
  if (!room) {
    throw notFound("Room not found");
  }
  return toDTO(room);
}
