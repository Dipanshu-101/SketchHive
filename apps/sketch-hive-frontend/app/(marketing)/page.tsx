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
 * Landing page — SketchHive V2.1 (reference-accurate recreation).
 *
 * Order matches the reference exactly: Nav → Hero → Features (Why SketchHive)
 * → Collaboration showcase → Stats → Testimonials → Final CTA → Footer. The bee
 * mascot recurs across sections carrying colored shapes along dashed
 * flight-paths.
 *
 * Server Component (SSR/SEO); interactive/animated pieces are isolated "use
 * client" components. All CTAs preserve existing routes (/signup, /signin,
 * /rooms).
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
