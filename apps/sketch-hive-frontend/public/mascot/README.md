# Mascot SVGs

Drop your bee SVG files here. Each file is a complete bee (already carrying its
shape) — there is no dynamic bee + shape compositing anymore.

Files are served from the site root, so `public/mascot/bee-cube.svg` is reachable
at the URL `/mascot/bee-cube.svg`.

## Expected filenames

`FloatingBee` picks a file by its `variant` prop. The variants used on the
landing page are:

| variant    | file               |
| ---------- | ------------------ |
| `cube`     | `bee-cube.svg`     |
| `triangle` | `bee-triangle.svg` |
| `sphere`   | `bee-sphere.svg`   |

To add a new variant, add a `bee-<name>.svg` file here and pass
`variant="<name>"` to `<FloatingBee>` (see
`features/marketing/components/FloatingBee.tsx`).

## Notes

- The bees are decorative (`aria-hidden`) and animated with a gentle float via
  Framer Motion — the SVG itself does not need any animation.
- Keep a roughly square viewBox so the bee scales cleanly to the `size` prop.
