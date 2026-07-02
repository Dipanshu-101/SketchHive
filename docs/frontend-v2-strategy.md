# SketchHive V2 — Frontend Architecture & Design Strategy

*Prepared as a pre-implementation design document. No code. Decisions only.*

---

## 0. Reading the References First

Before architecture, a quick honest read of what the six references are actually telling us — because the folder structure and component list should fall out of this, not the other way around.

**What's already working and should be locked in as brand law:**
- A single 3D-rendered bee mascot (not a flat icon) used as a *narrative* element — flying, carrying shapes, sitting near empty states — never just a logo mark repeated.
- A dashed, curved "flight path" line that trails the bee. This is a reusable *asset*, not a one-off illustration detail — it can become a loading-state motif, an onboarding-tour path, even a connection-line style on the canvas.
- Near-black surfaces (not pure `#000`) with a single saturated honey-yellow accent used *sparingly* — primary CTAs and active states only. Everything else is grayscale.
- Consistent generous corner radius (cards, inputs, buttons all round the same amount) and soft, low-opacity shadows rather than hard drop shadows — this reads as "premium," and it's the easiest thing to accidentally break by copy-pasting inconsistent radii later.

**Where I'd deviate from the references, and why:**
- The landing page hero currently has bees, dashed paths, *and* a floating canvas mockup competing in the same viewport quadrant. I'd give the mockup the visual priority and dial the decorative bees down to 1–2 per viewport, larger and more intentional, rather than scattered — scattered mascots read as clip-art at scale, intentional ones read as brand.
- The canvas screenshot's left chat panel and right participant rail are both permanently docked. On a real product this fights the user for canvas real estate constantly. I'd make both collapsible/flyout panels by default with the docked state as a user preference, not the default.
- Sign in / Sign up split-screen layout is good but shouldn't be a bespoke one-off page — it should be a reusable `<AuthLayout>` shell, because you'll want the same shell for "forgot password," "verify email," and "invite accept" screens later, and right now those don't exist yet.
- The join-room sidebar nav (Rooms / Starred / Recent / Templates / Settings) is really an app-shell concern, not a page concern — it should exist once and wrap Rooms, Settings, and Profile, not be redrawn per page.

None of this changes the visual language. It changes what's a reusable shell vs. what's a one-off screen — which is the actual point of this document.

---

## 1. Frontend Architecture

### Monorepo shape (Turborepo — extending what exists)

```
sketchhive/
├── apps/
│   ├── web/                    # Next.js app (marketing + auth + app shell)
│   └── docs/                   # (optional) component docs / storybook host
├── packages/
│   ├── ui/                     # Design system — dumb, presentational, no data
│   ├── canvas-kit/             # Canvas-specific UI (toolbar, minimap, panels) — NOT the drawing engine
│   ├── config/                 # tailwind config, tsconfig, eslint — shared
│   ├── icons/                  # SVG icon set, tree-shakeable
│   └── types/                  # Shared TS types (Room, User, Board, Message...)
├── turbo.json
└── package.json
```

**Why `canvas-kit` is separate from `ui`:** `packages/ui` should be genuinely generic — a `Button` or `Modal` that any SaaS product could use, zero SketchHive-specific logic. Canvas toolbar, participant rail, mini-map chrome are SketchHive-specific *presentational* components that wrap around the existing drawing engine but don't touch its logic. Keeping them separate stops the design system from accumulating one-off props "just for the canvas page," which is the #1 way design systems rot.

### `apps/web` internal structure

```
apps/web/
├── app/                        # Next.js App Router
│   ├── (marketing)/            # landing, pricing, docs — public, SEO'd, SSR
│   │   └── page.tsx
│   ├── (auth)/                 # sign-in, sign-up, forgot-password
│   │   ├── layout.tsx          # <AuthLayout> shell
│   │   ├── sign-in/page.tsx
│   │   └── sign-up/page.tsx
│   ├── (app)/                  # authenticated app shell
│   │   ├── layout.tsx          # sidebar + topbar shell
│   │   ├── rooms/page.tsx      # "Join a room"
│   │   ├── settings/page.tsx
│   │   ├── profile/page.tsx
│   │   └── canvas/[roomId]/page.tsx
│   └── not-found.tsx
├── features/                   # feature-sliced, NOT type-sliced
│   ├── auth/
│   │   ├── components/         # SignInForm, SignUpForm, SocialAuthButtons
│   │   ├── hooks/               # useAuth, useSignIn, useSignUp
│   │   └── services/            # auth.service.ts
│   ├── rooms/
│   │   ├── components/         # RoomCard, RoomFilters, CreateRoomModal
│   │   ├── hooks/
│   │   └── services/
│   ├── canvas/
│   │   ├── components/         # Toolbar, MiniMap, ParticipantRail, ChatPanel
│   │   ├── hooks/               # useCanvas, usePresence, useWebRTC
│   │   └── services/
│   └── chat/
├── components/                 # app-shell composition only (Sidebar, Topbar, AppShell)
├── lib/                         # api client, socket client, query client
└── styles/                     # globals.css, tailwind entry
```

**The one rule that matters most here:** organize by **feature**, not by type. A `components/`, `hooks/`, `services/` folder each containing 40 unrelated files is where monorepos go to die. Each feature folder is a vertical slice; `packages/ui` and `components/` (app-shell) are the only horizontal, cross-feature layers.

---

## 2. Design System (`packages/ui`)

### Tokens

Ship these as CSS variables (Tailwind v4 reads `@theme` natively — no JS token file needed, which also means no runtime cost and no build-time token generation step):

```css
@theme {
  /* Surface */
  --color-bg-base:      #0A0A0F;
  --color-bg-elevated:  #131318;
  --color-bg-overlay:   #1B1B22;
  --color-border:       #26262E;
  --color-border-hover: #35353F;

  /* Brand */
  --color-honey-500:    #F5A623;  /* primary */
  --color-honey-400:    #FFB84D;  /* hover */
  --color-honey-600:    #D68C10;  /* active/pressed */
  --color-honey-glow:   #F5A62333; /* focus rings, glassmorphism tint */

  /* Text */
  --color-text-primary:   #F5F5F7;
  --color-text-secondary: #A1A1AA;
  --color-text-muted:     #6B6B76;

  /* Semantic */
  --color-success: #34D399;
  --color-danger:  #F87171;
  --color-info:    #60A5FA;

  /* Radius scale — the "premium" feel lives here as much as color */
  --radius-sm: 8px;   /* inputs, badges, tags */
  --radius-md: 12px;  /* buttons, small cards */
  --radius-lg: 16px;  /* panels, modals */
  --radius-xl: 24px;  /* hero cards, auth panels */

  /* Elevation — soft, colored-black shadows, not gray */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.4);
  --shadow-md: 0 4px 16px rgba(0,0,0,0.45);
  --shadow-lg: 0 12px 40px rgba(0,0,0,0.55);
  --shadow-glow-honey: 0 0 0 3px var(--color-honey-glow);
}
```

**Spacing:** stick to Tailwind's default 4px scale — don't invent a custom one. The references show a consistent rhythm (cards use 16/24px padding, sections use 64–96px vertical gaps); that's achievable entirely with defaults. A custom spacing scale is a common source of overengineering for no visible benefit.

**Typography:** one geometric/grotesk sans for UI (Inter or Geist — matches the references' letterforms), and **keep the monospace font seen in the canvas screenshot** ("Project Ideas", "User Flow") as a deliberate second family reserved *only* for on-canvas text elements — it's a nice differentiator between "chrome" (UI) and "content" (what the user draws) and shouldn't leak into buttons or nav.

### Elevation & glass logic (so it doesn't become decoration soup)

Define three explicit surface types and never mix them arbitrarily:
1. **Flat surface** — sidebar, page background. `bg-base`, no shadow.
2. **Elevated card** — room cards, feature cards, form panels. `bg-elevated` + `shadow-md` + `border`.
3. **Floating/glass panel** — toolbars, modals, the mini-map, context menus — things that hover *over* canvas content. `bg-overlay` at ~85% opacity + `backdrop-blur` + `shadow-lg`.

Glassmorphism is reserved for category 3 only. This directly answers "glassmorphism only where appropriate" — the appropriateness rule is: **glass = floats over dynamic content, solid = sits in static layout.**

### Component states (every interactive primitive gets all five)

`default → hover → active/pressed → focus-visible → disabled`

- Hover: 150ms ease-out, background lightens one step, no movement.
- Active/pressed: scale(0.98), 80ms — gives tactile feedback without feeling laggy.
- Focus-visible: `--shadow-glow-honey` ring, never remove focus rings for a11y.
- Disabled: 40% opacity, no pointer events, no hover transition.

### What belongs in `packages/ui` (generic, reusable anywhere)

`Button` (primary/secondary/ghost/danger × sm/md/lg), `IconButton`, `Input`, `Textarea`, `Checkbox`, `Switch`, `Select`, `Modal`, `Drawer`, `Tooltip`, `Dropdown`/`Menu`, `Tabs`, `Badge`, `Avatar` + `AvatarGroup`, `Toast`/`ToastProvider`, `Tag`, `Card`, `Skeleton`, `EmptyState`, `SearchInput`, `Spinner`.

`AvatarGroup` and `EmptyState` are worth calling out specifically — the references imply both constantly (stacked participant avatars, and every empty-room/no-results scenario is a natural home for the bee mascot) but neither exists as a named component yet. Build them early.

---

## 3. Asset Organization

```
packages/icons/
└── src/                 # one SVG per file, PascalCase, tree-shakeable exports

apps/web/public/
├── brand/
│   ├── logo-full.svg           # wordmark + mark
│   ├── logo-mark.svg           # bee-in-hexagon only, for favicons/small spaces
│   └── logo-mark-mono.svg      # single-color, for watermarks/print
├── mascot/
│   ├── bee-flying.webp
│   ├── bee-carrying-shape.webp
│   ├── bee-waving.webp         # onboarding
│   ├── bee-thinking.webp       # loading states
│   ├── bee-empty-box.webp      # empty states
│   └── flight-path.svg         # the dashed trail, as a standalone reusable SVG path
├── illustrations/
│   └── auth/                   # the two side-panel scenes from sign-in/up
└── textures/
    └── grid-dot.svg            # canvas background pattern, hex-grid variant too
```

**Rules:**
- Mascot renders as **WebP with AVIF fallback**, never PNG in production — these are detailed 3D renders and PNG will bloat the bundle badly. Source files (Blender/Spline/whatever produced them) live outside the repo in a design tool, not committed.
- Every mascot pose gets a **semantic name** (`bee-thinking`, not `bee-pose-04`) so a developer building a new empty state can grep for what they need without opening Figma.
- `flight-path.svg` as an isolated asset matters more than it looks — it's reused as a decorative background element, as a literal SVG `<path>` for CSS `offset-path` animations (bee flying along it), and potentially as an onboarding-tour connector line. One asset, three use cases.

---

## 4. Animation Strategy

Motion library: **Framer Motion** for component-level transitions (already idiomatic in React, works cleanly with Next.js), plain CSS transitions for hover/active micro-states (cheaper, no JS needed for something as simple as a button hover).

### Reusable primitives (define once in `packages/ui/motion.ts`)

| Primitive | Use | Timing |
|---|---|---|
| `fadeInUp` | Cards entering viewport, modal content | 300ms ease-out |
| `scaleIn` | Modals, dropdowns, popovers | 200ms spring (stiffness 300, damping 25) |
| `slideInPanel` | Drawer, chat panel, participant rail | 250ms ease-out |
| `pressScale` | Button/card active state | 80ms |
| `beeFloat` | Idle bee illustrations — gentle Y-axis bob + slight rotate | 3–4s infinite ease-in-out loop |
| `beeFlyPath` | Bee traversing the dashed flight-path SVG | CSS `offset-path`, 2–3s, used sparingly (onboarding, success states) |
| `staggerChildren` | Feature-card grids, room lists | 40–60ms stagger |

**Principle for "premium not distracting":** every animation on this list either (a) confirms an action just took (button press, toast entering) or (b) guides attention to something new (modal opening, new chat message). Nothing animates just because it *can* — the bee-float loop is the one deliberate exception, reserved for illustration-only contexts (empty states, auth screens), never inside the working canvas where it would compete with the user's actual content.

**Canvas-specific:** cursor presence indicators (other users' cursors) should have their *own*, distinct motion signature — a subtle trailing fade, colored by user, no bounce — clearly different from mascot animation so users never mistake a collaborator's cursor for a brand element.

---

## 5. Component Inventory

**P0 — blocks everything else:**
`Button`, `Input`, `Checkbox`, `Avatar`, `AvatarGroup`, `Badge`, `Card`, `Modal`, `Toast`, `Tooltip`, `Spinner`, `EmptyState`

**P1 — needed for first full page (auth + rooms):**
`AuthLayout`, `SocialAuthButton`, `PasswordInput` (with visibility toggle), `RoomCard`, `RoomFilters`/`Tabs`, `SearchInput`, `Sidebar`, `SidebarNavItem`, `CreateRoomModal`, `Dropdown`

**P2 — canvas page:**
`CanvasToolbar`, `ToolbarButton`, `ColorSwatchPicker`, `ChatPanel`, `ChatBubble`, `ParticipantRail`, `MiniMap`, `ZoomControls`, `VideoCallBar`, `VideoTile`, `ContextMenu`, `VersionHistoryDrawer`, `NotificationPopover`

**P3 — settings, profile, polish:**
`SettingsSection`, `ProfileCard`, `Tabs` (reused), `DangerZoneCard`, `KeyboardShortcutsModal`, `AchievementBadge` (bee-themed, see §12)

Building in this order means every page after "rooms" is assembled almost entirely from things that already exist — canvas is the first page requiring genuinely new components, which is deliberate: it's also the riskiest page, so it should be tackled once the team has design-system muscle memory, not on day one.

---

## 6. Page Breakdown

**Landing (marketing, SSR, public):**
`Navbar` → `Hero` (headline + dual CTA + canvas mockup) → `FeatureGrid` (5× `FeatureCard`) → `StatsBar` → `ProductShowcase` (secondary mockup + bullet list) → `TestimonialCarousel` → `FinalCTA` → `Footer`

**Sign In / Sign Up** (share `AuthLayout`):
`AuthLayout` (illustration side + form side, swappable illustration/copy) → `AuthForm` → `PasswordInput` → `SocialAuthButtons` → `AuthFooterLink`

**Join a Room:**
`AppShell` (`Sidebar` + `Topbar`) → `PageHeader` → `SearchInput` + `RoomFilters` → `RoomGrid` (`RoomCard`[]) → `CreateRoomModal`

**Canvas:**
See §7 — this page gets its own section, it's structurally different from the rest.

**Settings / Profile:**
`AppShell` (reused) → `SettingsNav` (tabs: Account, Appearance, Notifications, Billing) → `SettingsSection`[] → `ProfileCard` + `AvatarUploader`

**404:**
`EmptyState` variant with the bee illustration ("bee-thinking" or a new "bee-lost" pose) — this page should cost almost nothing to build since `EmptyState` already exists from P0.

---

## 7. Canvas Architecture

This is the highest-risk page because it's the one place UI chrome and the (untouched) drawing engine have to coexist without the redesign leaking into engine logic. Structure it as **layout-only wrapper components around an unmodified engine mount point**:

```
features/canvas/
├── components/
│   ├── CanvasLayout.tsx        # grid/positioning shell — owns z-index and layout ONLY
│   ├── CanvasStage.tsx         # thin wrapper mounting the existing drawing engine
│   ├── toolbar/
│   │   ├── TopToolbar.tsx      # tool selection, undo/redo, video call, share
│   │   └── BottomToolbar.tsx   # color picker, stroke width, zoom
│   ├── panels/
│   │   ├── ChatPanel.tsx       # collapsible, left dock
│   │   ├── ParticipantRail.tsx # collapsible, right dock
│   │   ├── MiniMap.tsx         # bottom-right, floating
│   │   └── VersionHistoryDrawer.tsx
│   ├── ContextMenu.tsx         # right-click menu, positioned via portal
│   └── NotificationStack.tsx   # toast-like but canvas-scoped (e.g. "Alice joined")
├── hooks/
└── services/
```

**Layering model (bottom to top):**
1. `CanvasStage` — the engine's own canvas/DOM, full-bleed, untouched.
2. Docked panels (`ChatPanel`, `ParticipantRail`) — occupy layout space when open, collapse to slim rail when closed, never overlap the toolbar.
3. Floating chrome (`TopToolbar`, `BottomToolbar`, `MiniMap`) — positioned absolute, glass surface, always above the canvas content.
4. Transient layer (`ContextMenu`, `NotificationStack`, tooltips) — portal-rendered, highest z-index, dismiss-on-outside-click.

**Key decision:** `CanvasLayout` never imports engine internals directly — it only knows about a mount ref and a small, stable public API (`onToolChange`, `onZoomChange`, presence data in). This is what makes "redesign frontend without touching backend/engine" actually enforceable rather than just a stated intention — if the layout component needed engine internals, the boundary would already be broken.

**Mini-map** and **version history** don't exist in the current screenshot in obvious form — worth flagging now, before build, that these need their own small design pass rather than being improvised mid-implementation.

---

## 8. Hooks

| Hook | Responsibility |
|---|---|
| `useAuth()` | Session state, login/logout/register, exposes `user`, `isAuthenticated`, `isLoading` |
| `useRooms()` | Fetch/filter/create rooms; wraps `rooms.service` with caching (React Query) |
| `useCanvas()` | Bridges React UI state (active tool, zoom, color) to the existing drawing-engine instance — the seam between new UI and old engine |
| `usePresence()` | Who's in the room right now, cursor positions, join/leave events — over the existing WebSocket |
| `useChat()` | Message list, send/receive, typing indicators, scoped to a room |
| `useWebRTC()` | Video call connection state, local/remote streams — wraps the planned WebRTC layer |
| `useNotifications()` | In-app toast/notification queue, decoupled from any one feature |
| `useKeyboardShortcuts()` | Canvas hotkeys (tool switching, undo/redo) — centralized so shortcuts don't get redefined per-component |

Every hook returns data + actions, never JSX, and never calls `fetch`/`socket.emit` directly — that's the service layer's job (§9). This split is what keeps `useCanvas` testable independent of the actual rendering engine.

---

## 9. Service Layer

```
UI Components  →  Hooks  →  Services  →  Backend (Express/WebSocket, untouched)
```

```
lib/
├── api-client.ts        # single axios/fetch instance, interceptors, auth headers
├── socket-client.ts      # single WebSocket instance, reconnect logic
└── query-client.ts       # React Query instance/config

features/*/services/
├── auth.service.ts        # login(), register(), logout(), refreshToken()
├── rooms.service.ts        # listRooms(), createRoom(), joinRoom()
├── chat.service.ts         # sendMessage(), subscribeToRoom()
└── presence.service.ts     # subscribeToPresence(), broadcastCursor()
```

**Rule:** a page component or even a hook should never see `fetch(...)` or `socket.emit(...)` directly — everything routes through a `*.service.ts` file. Services are the *only* layer allowed to know backend endpoint shapes/socket event names. This means if a backend contract changes, exactly one file per feature needs to change, and components/hooks are completely insulated — this is the actual mechanism that satisfies "must not affect backend logic," since it makes the frontend genuinely swappable without the backend team being involved at all.

---

## 10. Migration Strategy

Given the backend, sockets, and drawing engine are working and must not be touched, the safest path is **strangler-fig, not big-bang rewrite**.

1. **Branch:** `feat/v2-frontend` off `main`, long-lived, rebased regularly (not merged) to avoid a giant conflict-laden merge at the end.
2. **New app shell, old pages coexist:** stand up `packages/ui` and the new `(app)` route group *alongside* the current UI. Use route groups / feature flags so `/rooms` can serve V2 to internal accounts while `/rooms-legacy` (or a flag) still serves V1 to everyone else.
3. **Migrate leaf-first, not root-first:** start with the pages that touch the *least* shared state — Landing and Auth have almost zero coupling to the engine/sockets, so they're safe to fully cut over early and get real user feedback fast. Canvas migrates last, once the design system has proven itself elsewhere.
4. **Never touch engine files during UI work:** enforce this with a CODEOWNERS rule on the drawing-engine directory requiring a second approving review from whoever owns engine code — a lightweight guardrail beats a purely verbal agreement.
5. **Parallel-run canvas:** for the highest-risk page, ship V2 canvas chrome behind a per-user flag before removing V1, so a bad interaction can be flagged off instantly rather than requiring a revert-and-redeploy.
6. **Delete old UI last, per-route, with a green period:** once a route has run V2 in production for a defined soak period (a couple of weeks is reasonable) with no elevated error rate, delete the old components for *that route only*. Don't batch-delete the whole legacy UI at the end — it removes your rollback safety net right when you need it least.
7. **Testing:** visual regression (Chromatic/Playwright screenshots) on `packages/ui` components in CI from day one — this is cheap insurance against silent design-system drift once multiple people are building against it. Engine/socket/backend test suites are untouched and keep gating as before.

---

## 11. Development Order

```
1. Design tokens + Tailwind theme        (packages/config, packages/ui base)
2. Core primitives (P0 components)        (Button, Input, Card, Modal, Toast, Avatar...)
3. AppShell + AuthLayout shells           (Sidebar, Topbar, Auth split-screen)
4. Landing page                           (lowest risk, highest external visibility — good early win)
5. Auth (Sign in / Sign up)               (P1 components complete)
6. Rooms ("Join a room")                  (validates data-fetching + service layer pattern)
7. Settings / Profile                     (cheap, reuses everything above — good for team momentum)
8. Canvas chrome                          (P2 components — highest risk, tackled with a proven system)
9. Animation pass                         (layer motion onto already-correct static UI, not before)
10. Bee brand-identity pass               (empty states, loading states, onboarding — see §12)
11. Full backend/socket integration test  (end-to-end, feature-flag removal, legacy deletion)
```

Two deliberate deviations from a naive "design system → build everything → polish" order, worth calling out:
- **Animation is step 9, not woven in throughout.** Building static-correct UI first and layering motion after means a broken animation never masks a broken layout — they're debugged independently.
- **Canvas is step 8, not step 4.** It's tempting to build the "hero" page first, but it's also the page with the most coupling to existing engine code and the most components with no precedent — building it after the system has already been proven on four lower-risk pages means the canvas build is mostly assembly, not invention.

---

## 12. Bee Brand Identity — Beyond the Logo

The mascot should show up anywhere the product would otherwise say nothing:

- **Empty states:** no rooms yet → bee holding an empty honeycomb cell; no search results → bee looking through a magnifying glass. Reuses the existing `EmptyState` component with a swappable mascot pose + copy.
- **Loading states:** replace generic spinners on *slow, meaningful* actions only (initial canvas load, account creation) — never on button-level micro-loading, where a plain `Spinner` is faster and less distracting. A "bee-thinking" pose with the flight-path looping is a good fit here.
- **Onboarding:** the bee can literally traverse `flight-path.svg` to point at UI elements in a first-run product tour — turns a generic tooltip tour into something on-brand instead of a bolted-on library.
- **Presence/collaboration:** when someone joins a room, a small bee-icon toast ("🐝 Alice joined the hive") is a nice, cheap way to reinforce the metaphor without new illustration work — reuses existing `NotificationStack`.
- **Cursor effects:** worth restraint here — *other users'* cursors should stay clean colored pointers with name labels (clarity matters more than branding mid-collaboration). Save mascot-flavored cursor effects for the *local* user's own idle/away state instead, where there's no risk of confusing it with a collaborator.
- **Achievements/milestones:** lightweight, optional — "First board created," "10 boards created," "Invited your first teammate" — small `AchievementBadge` toasts using bee poses. Low cost, nice retention lever, easy to cut from scope if time is tight without touching anything else.
- **404 / error states:** "bee-lost" pose, keeps even a broken-link moment on-brand rather than defaulting to a generic error page.

The throughline: mascot appearances are **tied to product moments** (empty, loading, joined, achieved, lost), not decorative filler — which is the difference between "the bee is part of the product" and "there's a bee in the corner."

---

## 13. Potential Pitfalls

- **Token drift:** if raw hex values start appearing in feature components instead of theme variables, the whole "premium, cohesive" effect erodes within a few PRs. Lint for it (a simple `no-restricted-syntax` ESLint rule blocking raw hex outside `packages/config`) rather than relying on code review discipline alone.
- **`packages/ui` scope creep:** the moment a component gets a `roomId` prop or imports a feature service, it's no longer a design-system component — it's a feature component that should move to `features/*/components`. Watch for this specifically during canvas work, where it's tempting to shortcut.
- **Glass overuse:** applying `backdrop-blur` everywhere because it "looks premium" tanks performance on lower-end devices and muddies the visual hierarchy defined in §2. Enforce the three-surface-type rule.
- **Animation on the canvas competing with content:** any looping/ambient animation placed too close to the actual drawing surface will read as a bug ("why is something moving on my board") rather than polish. Keep ambient motion (bee-float) strictly to illustration-only zones.
- **Docked panels eating canvas space by default:** as noted in §0, defaulting chat/participants to always-open on the canvas page will frustrate power users fast — make collapsed the default, expanded a remembered preference.
- **Mascot asset bloat:** 3D-rendered illustrations are heavy; without WebP/AVIF discipline and lazy-loading for below-the-fold marketing illustrations, the landing page's Lighthouse score will suffer, which matters since it's the SSR'd, SEO-facing page.
- **Parallel-run drift:** if the legacy and V2 UI coexist too long without the soak-period discipline in §10, feature work will start landing in both, doubling maintenance cost. Time-box the coexistence period per route explicitly.

---

## 14. Summary — What Happens Next

If this direction is right, the sequence to actually start building is: lock the token file → build the ~12 P0 primitives → stand up `AppShell`/`AuthLayout` → ship Landing and Auth first as low-risk, high-visibility wins → then Rooms → then the higher-risk Canvas work last, once the system has already proven itself. Nothing here has touched backend, socket, or engine code, and the service-layer boundary in §9 is what keeps it that way as implementation actually starts.

Happy to go deeper on any single section — the design system tokens, the canvas layering model, and the migration branching plan are probably the three worth the most additional scrutiny before code gets written.
