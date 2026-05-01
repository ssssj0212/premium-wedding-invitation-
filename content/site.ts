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
    buttonLabel: z.string(),
    contactEmail: z.string().optional().default(""),
    contactPhone: z.string().optional().default("")
  }),
  additionalInfo: z.object({
    title: z.string(),
    items: z.array(
      z.object({
        label: z.string(),
        value: z.string()
      })
    )
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
    subtitle: "",
    invitationLine: "We warmly invite you to our wedding luncheon."
  },
  event: {
    date: "2026-06-13",
    time: "11:30",
    venue: "Avra 33rd & Ninth",
    address: "398 9th Ave, New York, NY 10001",
    note: "Please plan to arrive by 11:30 AM so we can begin the luncheon together on time.",
    dressCode: "",
    timezoneLabel: "Eastern Time (ET)"
  },
  countdown: {
    message: "Counting down to our wedding lunch on Saturday, June 13, 2026 at 11:30 AM."
  },
  links: {
    mapUrl: "https://maps.google.com/?q=398+9th+Ave+New+York+NY+10001",
    rsvpUrl: "https://sejinshinhye-wedding.vercel.app/rsvp"
  },
  rsvp: {
    title: "Please let us know if you can join us.",
    description: "",
    buttonLabel: "RSVP",
    contactEmail: "",
    contactPhone: ""
  },
  additionalInfo: {
    title: "Info",
    items: [
      {
        label: "Dress Code",
        value: "Semi-formal"
      },
      {
        label: "Transportation",
        value: "Nearby transit:\nPenn Station / Moynihan Train Hall\nAmtrak, LIRR, NJ Transit\n\nSubway:\nA/C/E, 1/2/3, 7"
      },
      {
        label: "Parking",
        value: ""
      },
      {
        label: "Questions?",
        value: "347-449-2534"
      }
    ]
  },
  features: {
    showGiftSection: false,
    expandGiftSectionByDefault: false,
    showRsvpSection: true,
    enableBackgroundMusic: false
  },
  audio: {
    src: "/audio/bgm.mp3"
  },
  theme: {
    accentColor: "#7a6250"
  }
});

export type SiteContent = typeof siteContent;
