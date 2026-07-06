# Public assets

Asset organization for SketchHive V2 (see `docs/frontend-v2-strategy.md` §3).
Folders are scaffolded now; artwork is added in later phases (the bee
brand-identity pass, §12). **Do not** add loose files at the root of `public/` —
place them in the right folder below.

```
public/
├── brand/            # logo-full.svg, logo-mark.svg, logo-mark-mono.svg
├── mascot/           # 3D bee poses — semantic names, WebP (AVIF fallback):
│                     #   bee-flying, bee-carrying-shape, bee-waving,
│                     #   bee-thinking, bee-empty-box, bee-lost
│                     # plus flight-path.svg (the dashed trail, reused as a
│                     # decorative bg, a CSS offset-path, and an onboarding line)
├── illustrations/
│   └── auth/         # the split-screen auth side-panel scenes
└── textures/         # grid-dot.svg / hex-grid canvas background patterns
```

## Rules (§3)

- **Mascot = WebP with AVIF fallback, never PNG in production.** These are
  detailed 3D renders; PNG bloats the bundle. Lazy-load below-the-fold marketing
  illustrations so the SSR'd landing page keeps its Lighthouse score.
- **Semantic names** (`bee-thinking`, not `bee-pose-04`) so a dev building a new
  empty state can grep for the pose they need.
- **Source files** (Blender/Spline) live in the design tool, **not** committed.
- `flight-path.svg` is an isolated, reusable asset — one file, three use cases.
