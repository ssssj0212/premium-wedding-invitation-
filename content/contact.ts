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
      phone: "+1 212-555-0139",
      zelle: "add-sejin-zelle@example.com",
      note: "Replace this with Sejin's real phone number and Zelle details."
    },
    {
      role: "Bride",
      name: "Shinhye Kim",
      phone: "+1 212-555-0174",
      zelle: "add-shinhye-zelle@example.com",
      note: "Replace this with Shinhye's real phone number and Zelle details."
    }
  ]
});

export type ContactEntry = (typeof contactContent.contacts)[number];
