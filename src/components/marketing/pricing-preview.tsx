import { Check } from "lucide-react";

import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeader } from "@/components/marketing/section-header";
import { WaitlistDialog } from "@/components/marketing/waitlist-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { pricingPlans } from "@/lib/content/landing";
import { cn } from "@/lib/utils";

export function PricingPreview() {
  return (
    <section id="pricing" className="border-b bg-secondary/45 py-20 sm:py-24">
      <div className="site-container">
        <FadeIn>
          <SectionHeader
            eyebrow="Pricing preview"
            title="Simple plans for practice habits and prep sprints."
            description="Pricing is static in this phase. Billing, accounts, and team management will be implemented later."
          />
        </FadeIn>

        <FadeIn className="mt-10 flex justify-center">
          <Tabs defaultValue="individual" className="w-full">
            <div className="flex justify-center">
              <TabsList aria-label="Pricing mode">
                <TabsTrigger value="individual">Individual</TabsTrigger>
                <TabsTrigger value="cohort">Cohort</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="individual">
              <div className="grid gap-4 lg:grid-cols-3">
                {pricingPlans.map((plan) => (
                  <PricingCard key={plan.name} plan={plan} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="cohort">
              <div className="mx-auto max-w-2xl rounded-lg border bg-background p-6 shadow-sm">
                <Badge variant="success">Cohort preview</Badge>
                <h3 className="mt-5 text-2xl font-semibold tracking-normal">
                  Run structured peer practice for a group.
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Cohort tooling is planned for bootcamps, universities, and
                  internal engineering academies. The frontend architecture is
                  ready for admin views, analytics, and private matching pools.
                </p>
                <WaitlistDialog>
                  <Button className="mt-6">Request cohort access</Button>
                </WaitlistDialog>
              </div>
            </TabsContent>
          </Tabs>
        </FadeIn>
      </div>
    </section>
  );
}

function PricingCard({ plan }: { plan: (typeof pricingPlans)[number] }) {
  return (
    <Card
      className={cn(
        "relative h-full",
        plan.highlighted && "border-primary shadow-soft",
      )}
    >
      {plan.highlighted ? (
        <div className="absolute right-4 top-4">
          <Badge variant="success">Most focused</Badge>
        </div>
      ) : null}
      <CardHeader>
        <CardTitle>{plan.name}</CardTitle>
        <CardDescription>{plan.description}</CardDescription>
        <div className="pt-4">
          <span className="text-4xl font-semibold tracking-normal">
            {plan.price}
          </span>
          {plan.price.startsWith("$") ? (
            <span className="text-sm text-muted-foreground"> / month</span>
          ) : null}
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {plan.features.map((feature) => (
            <li key={feature} className="flex gap-2 text-sm leading-6">
              <Check className="mt-1 size-4 shrink-0 text-primary" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <WaitlistDialog>
          <Button
            className="w-full"
            variant={plan.highlighted ? "default" : "outline"}
          >
            {plan.cta}
          </Button>
        </WaitlistDialog>
      </CardFooter>
    </Card>
  );
}
