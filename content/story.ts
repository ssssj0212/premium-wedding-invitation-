import { z } from "zod";
import { validateContent } from "@/lib/content";

const storySchema = z.object({
  invitationTitle: z.string(),
  invitationSubtitle: z.string(),
  messageParagraphs: z.array(z.string())
});

export const storyContent = validateContent(storySchema, {
  invitationTitle: "We warmly invite you to celebrate our wedding day.",
  invitationSubtitle: "",
  messageParagraphs: [
    "With grateful hearts, we are delighted to invite you to celebrate our marriage.",
    "Please join us for a joyful lunch, warm conversation, and a beautiful afternoon together.",
    "Having you with us on Saturday, June 13, 2026 would mean so much as we begin this new chapter."
  ]
});
