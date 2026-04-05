import { z } from "zod";
import { validateContent } from "@/lib/content";

const faqItemSchema = z.object({
  question: z.string(),
  answer: z.string()
});

const faqSchema = z.object({
  items: z.array(faqItemSchema)
});

export const faqContent = validateContent(faqSchema, {
  items: []
});

export type FAQItem = (typeof faqContent.items)[number];
