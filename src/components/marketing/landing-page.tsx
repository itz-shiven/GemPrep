import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { FAQ } from "@/components/marketing/faq";
import { Features } from "@/components/marketing/features";
import { Hero } from "@/components/marketing/hero";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { PricingPreview } from "@/components/marketing/pricing-preview";
import { Testimonials } from "@/components/marketing/testimonials";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Testimonials />
        <PricingPreview />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
