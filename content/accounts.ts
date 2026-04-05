import { z } from "zod";
import { validateContent } from "@/lib/content";

const accountEntrySchema = z.object({
  label: z.string(),
  bankName: z.string(),
  accountNumber: z.string(),
  accountHolder: z.string(),
  note: z.string().optional()
});

const accountGroupSchema = z.object({
  id: z.string(),
  sideLabel: z.string(),
  title: z.string(),
  description: z.string().optional(),
  collapsible: z.boolean().default(true),
  defaultOpen: z.boolean().default(false),
  entries: z.array(accountEntrySchema)
});

const accountSchema = z.object({
  title: z.string(),
  description: z.string(),
  introEyebrow: z.string(),
  introNote: z.string(),
  groups: z.array(accountGroupSchema)
});

export const accountsContent = validateContent(accountSchema, {
  title: "For those who have asked about a gift",
  description:
    "Your warm presence is the greatest gift to us. For loved ones who wish to send their blessings from afar, the details below are provided with gratitude and care.",
  introEyebrow: "With sincere thanks",
  introNote:
    "This section is designed for Korean-style bank sharing and can be shown discreetly, grouped by side, or hidden entirely with one feature flag.",
  groups: [
    {
      id: "groom",
      sideLabel: "Groom",
      title: "Groom's Side",
      description: "For congratulations shared with the groom and his family.",
      collapsible: true,
      defaultOpen: true,
      entries: [
        {
          label: "Groom",
          bankName: "신한은행",
          accountNumber: "110-123-456789",
          accountHolder: "김세진"
        },
        {
          label: "Groom's Mother",
          bankName: "국민은행",
          accountNumber: "123401-04-567890",
          accountHolder: "박은영"
        }
      ]
    },
    {
      id: "bride",
      sideLabel: "Bride",
      title: "Bride's Side",
      description: "For congratulations shared with the bride and her family.",
      collapsible: true,
      defaultOpen: false,
      entries: [
        {
          label: "Bride",
          bankName: "하나은행",
          accountNumber: "321-910234-56707",
          accountHolder: "이민지"
        },
        {
          label: "Bride's Father",
          bankName: "농협은행",
          accountNumber: "352-2087-1234-56",
          accountHolder: "이정호",
          note: "Replace with your real information or remove this entry."
        }
      ]
    }
  ]
});

export type AccountGroup = (typeof accountsContent.groups)[number];
export type AccountEntry = AccountGroup["entries"][number];
