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
      <div className="flex flex-col gap-6">
        <SectionHeading
          eyebrow="RSVP"
          title={siteContent.rsvp.title}
          description={siteContent.rsvp.description}
          align="center"
        />
        <div className="flex justify-center">
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-text px-6 py-4 text-sm font-semibold text-[#fff8f2] transition duration-500 hover:bg-[#4c3f35]"
          >
            {siteContent.rsvp.buttonLabel}
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </SectionShell>
  );
}
