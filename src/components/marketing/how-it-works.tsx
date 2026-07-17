import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeader } from "@/components/marketing/section-header";
import { Badge } from "@/components/ui/badge";
import { workflowSteps } from "@/lib/content/landing";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-b bg-secondary/45 py-20 sm:py-24">
      <div className="site-container">
        <FadeIn>
          <SectionHeader
            eyebrow="Workflow"
            title="From target role to better signal in four focused steps."
            description="Every session should produce a useful next action. GEMPREP is shaped around that loop from the first screen."
          />
        </FadeIn>

        <div className="mt-12 grid gap-4 lg:grid-cols-4">
          {workflowSteps.map((step, index) => (
            <FadeIn key={step.title} delay={index * 0.05}>
              <div className="h-full rounded-lg border bg-background p-5 shadow-sm">
                <Badge variant="outline">Step {index + 1}</Badge>
                <h3 className="mt-5 text-lg font-semibold tracking-normal">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
