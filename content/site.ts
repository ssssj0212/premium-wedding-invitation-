import { z } from "zod";
import { validateContent } from "@/lib/content";

const siteSchema = z.object({
  couple: z.object({
    groomName: z.string(),
    brideName: z.string()
  }),
  hero: z.object({
    kicker: z.string(),
    subtitle: z.string(),
    invitationLine: z.string()
  }),
  event: z.object({
    date: z.string(),
    time: z.string(),
    venue: z.string(),
    address: z.string(),
    note: z.string(),
    dressCode: z.string().optional().default(""),
    timezoneLabel: z.string()
  }),
  countdown: z.object({
    message: z.string()
  }),
  links: z.object({
    mapUrl: z.string().url(),
    rsvpUrl: z.string().url().optional().or(z.literal(""))
  }),
  rsvp: z.object({
    title: z.string(),
    description: z.string(),
    contactEmail: z.string().optional().default(""),
    contactPhone: z.string().optional().default("")
  }),
  features: z.object({
    showGiftSection: z.boolean(),
    expandGiftSectionByDefault: z.boolean(),
    showRsvpSection: z.boolean(),
    enableBackgroundMusic: z.boolean()
  }),
  audio: z.object({
    src: z.string()
  }),
  theme: z.object({
    accentColor: z.string()
  })
});

export const siteContent = validateContent(siteSchema, {
  couple: {
    groomName: "Sejin Shin",
    brideName: "Shinhye Kim"
  },
  hero: {
    kicker: "With great joy",
    subtitle:
      "Together with our families, we warmly invite you to join us for our wedding luncheon and celebration.",
    invitationLine:
      "We would be honored to celebrate this joyful day with you over lunch, photographs, and a beautiful afternoon together."
  },
  event: {
    date: "2026-06-13",
    time: "11:30",
    venue: "Avra 33rd & Ninth",
    address: "398 9th Ave, New York, NY 10001",
    note: "Please arrive by 11:30 AM and kindly avoid being late so we may begin together on time.",
    dressCode: "",
    timezoneLabel: "Eastern Time (ET)"
  },
  countdown: {
    message: "Counting down to our wedding lunch on Saturday, June 13, 2026 at 11:30 AM."
  },
  links: {
    mapUrl: "https://maps.google.com/?q=398+9th+Ave+New+York+NY+10001",
    rsvpUrl: ""
  },
  rsvp: {
    title: "RSVP",
    description: "Add your RSVP form link, email, or phone later to enable this section.",
    contactEmail: "",
    contactPhone: ""
  },
  features: {
    showGiftSection: false,
    expandGiftSectionByDefault: false,
    showRsvpSection: false,
    enableBackgroundMusic: false
  },
  audio: {
    src: "/audio/bgm.mp3"
  },
  theme: {
    accentColor: "#b88f73"
  }
});

export type SiteContent = typeof siteContent;
