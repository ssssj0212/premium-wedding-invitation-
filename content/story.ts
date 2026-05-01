import { z } from "zod";
import { validateContent } from "@/lib/content";

const storySchema = z.object({
  invitationTitle: z.string(),
  invitationSubtitle: z.string(),
  messageParagraphs: z.array(z.string())
});

export const storyContent = validateContent(storySchema, {
  invitationTitle: "",
  invitationSubtitle: "",
  messageParagraphs: [
    "With grateful hearts, we are happy to share that we were married in an intimate ceremony with our families on June 4, 2026.",
    "To continue the celebration, we would be honored to have our close friends and loved ones join us for a wedding luncheon.",
    "Your presence would mean so much to us as we celebrate this special season together."
  ]
});
