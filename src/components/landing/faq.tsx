"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ_ITEMS = [
  {
    q: "Is GemPrep an AI interviewer?",
    a: "No. GemPrep connects you with real software engineers for mock interviews. AI is only used behind the scenes to suggest follow-up questions to the interviewer — it never talks to the candidate.",
  },
  {
    q: "What types of interviews are supported?",
    a: "Currently, GemPrep focuses on DSA (Data Structures & Algorithms) coding interviews. System design, HR, and other interview types are planned for future releases.",
  },
  {
    q: "How long is each interview session?",
    a: "Each session is approximately 60 minutes and follows a structured flow: 5-minute introduction, 40-minute coding round, and 15-minute discussion.",
  },
  {
    q: "What programming languages are supported?",
    a: "The coding editor supports C++, Java, Python, JavaScript, and C. Code can be compiled and run directly inside the platform.",
  },
  {
    q: "Is it free to use?",
    a: "GemPrep is free during the MVP phase. Premium features and subscription plans are planned for future versions.",
  },
  {
    q: "Can I practice with my friends?",
    a: "Yes. You can create a private interview room and share the unique room code with anyone you want to practice with.",
  },
  {
    q: "Do I need to upload my resume?",
    a: "It's optional but recommended. Your resume is displayed to the interviewer during the session, making the practice more realistic.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="relative py-32">
      <div className="mx-auto max-w-3xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-sm font-medium text-primary mb-3 tracking-wide uppercase">
            FAQ
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently asked questions
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Accordion type="single" collapsible className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="rounded-xl border border-border/50 bg-card/30 px-6 data-[state=open]:bg-card/60 transition-colors"
              >
                <AccordionTrigger className="text-left text-sm font-medium hover:no-underline py-4">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground pb-4 leading-relaxed">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
