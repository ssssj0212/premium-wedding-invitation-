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
      zelle: "add-sejin-zelle@example.com",
      note: ""
    },
    {
      role: "Bride",
      name: "Shinhye Kim",
      phone: "",
      zelle: "add-shinhye-zelle@example.com",
      note: ""
    }
  ]
});

export type ContactEntry = (typeof contactContent.contacts)[number];
