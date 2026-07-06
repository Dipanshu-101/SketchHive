import Link from "next/link";
import { EmptyState, Button } from "@repo/ui";

/**
 * 404 — built from the P0 <EmptyState> per §6. The illustration slot is where a
 * "bee-lost" mascot pose drops in during the later bee brand-identity pass (§12);
 * for now it renders copy + a return-home CTA.
 */
export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <EmptyState
        title="This page flew away"
        description="We couldn't find what you were looking for. It may have been moved or never existed."
        action={
          <Link href="/" style={{ textDecoration: "none" }}>
            <Button variant="primary">Back to home</Button>
          </Link>
        }
      />
    </div>
  );
}
