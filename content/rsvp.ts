import { z } from "zod";
import { validateContent } from "@/lib/content";

const rsvpFormSchema = z.object({
  copy: z.object({
    title: z.string(),
    subtitle: z.string(),
    deadline: z.string(),
    intro: z.string(),
    attendanceQuestion: z.string(),
    attendingLabel: z.string(),
    attendingDescription: z.string(),
    undecidedLabel: z.string(),
    undecidedDescription: z.string(),
    guestCountTitle: z.string(),
    guestCountDescription: z.string(),
    guestCountQuestion: z.string(),
    guestNamesTitle: z.string(),
    guestNamesDescription: z.string(),
    entreeLabel: z.string(),
    entreePlaceholder: z.string(),
    entreeValidationMessage: z.string(),
    messageLabel: z.string(),
    messageHelperText: z.string(),
    undecidedTitle: z.string(),
    undecidedNoteDescription: z.string(),
    noteLabel: z.string(),
    submitRsvp: z.string(),
    submitResponse: z.string(),
    next: z.string(),
    back: z.string(),
    backToInvitation: z.string(),
    attendingThankYouTitle: z.string(),
    attendingThankYouMessage: z.string(),
    undecidedThankYouTitle: z.string(),
    undecidedThankYouMessage: z.string(),
    errorMessage: z.string()
  })
});

export const rsvpFormContent = validateContent(rsvpFormSchema, {
  copy: {
    title: "RSVP",
    subtitle: "Please let us know if you can join us.",
    deadline: "Kindly respond by May 23, 2026.",
    intro:
      "If you are able to attend, please select Attending. If you are not sure yet, please select Undecided and leave a short note.",
    attendanceQuestion: "Will you be attending?",
    attendingLabel: "Attending",
    attendingDescription: "I/we will join the wedding luncheon.",
    undecidedLabel: "Undecided",
    undecidedDescription: "I/we are not sure yet.",
    guestCountTitle: "Guest Count",
    guestCountDescription: "Please let us know how many guests will be attending with you.",
    guestCountQuestion: "Number of Guests",
    guestNamesTitle: "Guest Names",
    guestNamesDescription: "Please enter the full name and entree choice for each guest.",
    entreeLabel: "Entree choice",
    entreePlaceholder: "Select an entree",
    entreeValidationMessage: "Please choose an entree for each guest.",
    messageLabel: "Message (Allergies or dietary notes)",
    messageHelperText: "Please let us know if you have any allergies or dietary restrictions.",
    undecidedTitle: "Undecided",
    undecidedNoteDescription:
      "No worries. Please leave us a short note, and kindly let us know your final decision by May 23, 2026.",
    noteLabel: "Short note",
    submitRsvp: "Submit RSVP",
    submitResponse: "Submit Response",
    next: "Next",
    back: "Back",
    backToInvitation: "Back to Invitation",
    attendingThankYouTitle: "Thank you for your RSVP.",
    attendingThankYouMessage: "We’re so grateful to celebrate with you.",
    undecidedThankYouTitle: "Thank you for letting us know.",
    undecidedThankYouMessage: "Please feel free to reach out once your plans are confirmed.",
    errorMessage: "Something went wrong. Please try again or contact us."
  }
});

export type RsvpFormContent = typeof rsvpFormContent;
