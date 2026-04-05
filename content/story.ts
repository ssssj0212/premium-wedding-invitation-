import { z } from "zod";
import { validateContent } from "@/lib/content";

const storySchema = z.object({
  invitationTitle: z.string(),
  invitationSubtitle: z.string(),
  messageParagraphs: z.array(z.string())
});

export const storyContent = validateContent(storySchema, {
  invitationTitle: "We warmly invite you to celebrate our wedding day.",
  invitationSubtitle:
    "A warm and elegant invitation to join us for our wedding lunch in New York.",
  messageParagraphs: [
    "With grateful hearts, we are delighted to invite you to celebrate our marriage with us.",
    "Please join us for a joyful lunch, warm conversation, and a beautiful afternoon shared with family and friends.",
    "Your presence on Saturday, June 13, 2026 would mean so much to us as we begin this new chapter together."
  ]
});
