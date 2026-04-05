import { z } from "zod";
import { validateContent } from "@/lib/content";

const scheduleItemSchema = z.object({
  time: z.string(),
  title: z.string(),
  description: z.string()
});

const scheduleSchema = z.object({
  items: z.array(scheduleItemSchema)
});

export const scheduleContent = validateContent(scheduleSchema, {
  items: [
    {
      time: "11:30 AM - 12:00 PM",
      title: "Welcome Drinks",
      description: "Please arrive by 11:30 AM. Welcome drinks will be served before lunch begins."
    },
    {
      time: "12:00 PM - 2:00 PM",
      title: "Lunch",
      description: "A seated lunch will be served for our guests."
    },
    {
      time: "2:00 PM onward",
      title: "Photography & Prize Announcement",
      description: "After lunch, we will take photos together and continue with prize and event announcements."
    }
  ]
});

export type ScheduleItem = (typeof scheduleContent.items)[number];
