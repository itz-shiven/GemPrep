import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeader } from "@/components/marketing/section-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { featureHighlights } from "@/lib/content/landing";

export function Features() {
  return (
    <section id="features" className="border-b bg-background py-20 sm:py-24">
      <div className="site-container">
        <FadeIn>
          <SectionHeader
            eyebrow="Foundation"
            title="A product surface built for serious interview practice."
            description="The frontend foundation is organized around reusable primitives, responsive composition, and product workflows that can scale into dashboards, interview rooms, and backend-backed collaboration."
          />
        </FadeIn>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featureHighlights.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <FadeIn key={feature.title} delay={index * 0.04}>
                <Card className="h-full transition-colors hover:border-primary/35">
                  <CardHeader>
                    <span className="mb-3 grid size-10 place-items-center rounded-lg border bg-secondary text-primary">
                      <Icon className="size-5" />
                    </span>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-px bg-border" />
                  </CardContent>
                </Card>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
