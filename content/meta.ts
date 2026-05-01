import { z } from "zod";
import { validateContent } from "@/lib/content";

const metaSchema = z.object({
  title: z.string(),
  description: z.string(),
  siteUrl: z.string().url(),
  locale: z.string(),
  ogTitle: z.string(),
  ogDescription: z.string(),
  ogImage: z.string(),
  ogImageAlt: z.string(),
  keywords: z.array(z.string())
});

export const metaContent = validateContent(metaSchema, {
  title: "Sejin Shin & Shinhye Kim Wedding Invitation",
  description:
    "A premium mobile-first wedding invitation website with elegant details, gallery, contact information, and sharing support.",
  siteUrl: "https://sejinshinhye-wedding.vercel.app",
  locale: "en",
  ogTitle: "Sejin Shin & Shinhye Kim | Wedding Invitation",
  ogDescription: "Join us as we celebrate our wedding day with love, warmth, and gratitude.",
  ogImage: "https://sejinshinhye-wedding.vercel.app/og/share-preview.jpg?v=20260427",
  ogImageAlt: "Wedding invitation preview image",
  keywords: ["wedding invitation", "mobile wedding invitation", "Korean wedding invitation", "modern wedding website"]
});
