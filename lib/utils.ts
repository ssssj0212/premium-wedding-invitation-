import { clsx, type ClassValue } from "clsx";
import { siteContent } from "@/content/site";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function createCalendarLink() {
  const start = new Date(`${siteContent.event.date}T${siteContent.event.time}:00`);
  const end = new Date(start.getTime() + 4 * 60 * 60 * 1000);

  const format = (value: Date) => value.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${siteContent.couple.groomName} & ${siteContent.couple.brideName} Wedding`,
    dates: `${format(start)}/${format(end)}`,
    details: siteContent.hero.invitationLine,
    location: `${siteContent.event.venue}, ${siteContent.event.address}`
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
