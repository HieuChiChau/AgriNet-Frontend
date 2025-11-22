import { LandingHero } from "@/components/organisms/landing/hero";
import { LandingFeatures } from "@/components/organisms/landing/features";
import { LandingStats } from "@/components/organisms/landing/stats";
import { LandingFinalCTA } from "@/components/organisms/landing/final-cta";

export default async function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-green-50 via-white to-yellow-50">
      <LandingHero />
      <LandingFeatures />
      <LandingStats />
      <LandingFinalCTA />
    </div>
  );
}
