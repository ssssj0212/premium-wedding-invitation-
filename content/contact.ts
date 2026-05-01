import { z } from "zod";
import { validateContent } from "@/lib/content";

const contactSchema = z.object({
  contacts: z.array(
    z.object({
      role: z.string(),
      name: z.string(),
      phone: z.string(),
      zelle: z.string().optional(),
      note: z.string().optional()
    })
  )
});

export const contactContent = validateContent(contactSchema, {
  contacts: [
    {
      role: "Groom",
      name: "Sejin Shin",
      phone: "",
      zelle: "347-449-2534",
      note: ""
    },
    {
      role: "Bride",
      name: "Shinhye Kim",
      phone: "",
      zelle: "646-419-0220",
      note: ""
    }
  ]
});

export type ContactEntry = (typeof contactContent.contacts)[number];
