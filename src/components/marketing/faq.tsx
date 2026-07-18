import { Plus } from "lucide-react";

import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeader } from "@/components/marketing/section-header";
import { faqs } from "@/lib/content/landing";

export function FAQ() {
  return (
    <section id="faq" className="bg-background py-20 sm:py-24">
      <div className="site-container">
        <FadeIn>
          <SectionHeader
            eyebrow="FAQ"
            title="Questions candidates ask before the first mock."
            description="Clear expectations for matching, live rooms, AI feedback, and how GEMPREP keeps practice useful."
          />
        </FadeIn>

        <div className="mx-auto mt-12 max-w-3xl divide-y rounded-lg border bg-card">
          {faqs.map((faq) => (
            <details key={faq.question} className="group">
              <summary className="focus-ring flex cursor-pointer list-none items-center justify-between gap-4 rounded-md px-5 py-4 text-left text-sm font-medium marker:hidden">
                {faq.question}
                <Plus className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-45" />
              </summary>
              <p className="px-5 pb-5 text-sm leading-6 text-muted-foreground">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
