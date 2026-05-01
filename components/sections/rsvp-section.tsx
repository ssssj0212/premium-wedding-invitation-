import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";
import { SectionShell } from "@/components/section-shell";
import { siteContent } from "@/content/site";

export function RsvpSection() {
  if (!siteContent.features.showRsvpSection) {
    return null;
  }

  return (
    <SectionShell id="rsvp">
      <div className="flex flex-col gap-6">
        <div className="mx-auto max-w-2xl text-center">
          <SectionHeading eyebrow="RSVP" title="" description="" align="center" />
          <h2 className="mx-auto -mt-1 max-w-[24ch] font-serif text-[1.38rem] font-medium leading-[1.2] tracking-[-0.025em] text-text sm:text-[1.5rem]">
            {siteContent.rsvp.title}
          </h2>
        </div>
        <div className="flex justify-center">
          <Link
            href="/rsvp"
            aria-label="Open RSVP"
            className="btn-primary inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[15px] font-semibold transition"
          >
            {siteContent.rsvp.buttonLabel}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </SectionShell>
  );
}
