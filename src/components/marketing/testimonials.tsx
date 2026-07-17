import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeader } from "@/components/marketing/section-header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { testimonials } from "@/lib/content/landing";

export function Testimonials() {
  return (
    <section className="border-b bg-background py-20 sm:py-24">
      <div className="site-container">
        <FadeIn>
          <SectionHeader
            eyebrow="Feedback"
            title="Designed for candidates who need signal, not noise."
            description="The UI language favors direct feedback, clean review states, and low-friction practice habits."
          />
        </FadeIn>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <FadeIn key={testimonial.name} delay={index * 0.05}>
              <Card className="h-full">
                <CardContent className="flex h-full flex-col p-6">
                  <p className="text-base leading-7 text-foreground">
                    &quot;{testimonial.quote}&quot;
                  </p>
                  <div className="mt-8 flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{testimonial.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
