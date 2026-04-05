import { ArrowUpRight } from "lucide-react";
import { siteContent } from "@/content/site";
import { SectionHeading } from "@/components/section-heading";
import { SectionShell } from "@/components/section-shell";

export function RsvpSection() {
  const href =
    siteContent.links.rsvpUrl ||
    (siteContent.rsvp.contactEmail
      ? `mailto:${siteContent.rsvp.contactEmail}?subject=${encodeURIComponent("Wedding RSVP")}`
      : siteContent.rsvp.contactPhone
        ? `sms:${siteContent.rsvp.contactPhone.replaceAll(" ", "")}`
        : "");

  if (!href) {
    return null;
  }

  return (
    <SectionShell id="rsvp">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          eyebrow="RSVP"
          title={siteContent.rsvp.title}
          description={siteContent.rsvp.description}
        />
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-text px-5 py-4 text-sm font-semibold text-[#fff8f2] transition hover:bg-[#4d4037]"
        >
          Reply Here
          <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>
    </SectionShell>
  );
}
