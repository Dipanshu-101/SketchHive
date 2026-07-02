import {
  MarketingNav,
  HoneyAmbientBg,
  Hero,
  Features,
  CollaborateShowcase,
  StatsBar,
  Testimonials,
  FinalCTA,
  MarketingFooter,
} from "@/features/marketing/components";

/**
 * Landing page — SketchHive V2.
 *
 * Storytelling order (§6/§11): Hero → Features → Collaboration showcase →
 * Stats → Testimonials → Final CTA → Footer. The bee mascot bookends the page
 * (hero + CTA) and dashed flight-paths thread the margins, so the mascot reads
 * as part of the product, not a corner logo. All CTAs preserve the existing
 * routes (/signup, /signin, /rooms).
 *
 * This is a Server Component (SSR/SEO-friendly per §6); the interactive bits
 * (nav scroll state, hover) are isolated in their own "use client" components.
 */
export default function LandingPage() {
  return (
    <>
      <HoneyAmbientBg />
      <div style={{ position: "relative", zIndex: 1 }}>
        <MarketingNav />
        <main>
          <Hero />
          <Features />
          <CollaborateShowcase />
          <StatsBar />
          <Testimonials />
          <FinalCTA />
        </main>
        <MarketingFooter />
      </div>
    </>
  );
}
