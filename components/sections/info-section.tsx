import { CalendarPlus, Clock3, ExternalLink, MapPinned, Shirt } from "lucide-react";
import { siteContent } from "@/content/site";
import { formatEventTime, formatWeddingDate } from "@/lib/date";
import { createCalendarLink } from "@/lib/utils";
import { SectionHeading } from "@/components/section-heading";
import { SectionShell } from "@/components/section-shell";

export function InfoSection() {
  const hasDressCode = Boolean(siteContent.event.dressCode?.trim());

  return (
    <SectionShell id="details">
      <SectionHeading
        eyebrow="Wedding Details"
        title="Join us for a day of warmth, vows, and celebration."
        description={siteContent.event.note}
        align="center"
      />
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="section-panel rounded-[26px] p-5 sm:p-6">
          <div className="flex items-center gap-3 text-text">
            <Clock3 className="h-5 w-5 text-accent" />
            <p className="luxury-kicker text-muted">When</p>
          </div>
          <div className="mt-5 text-center">
            <p className="font-serif text-[1.5rem] leading-[1.08] tracking-[-0.04em] text-text sm:text-[1.75rem]">
              {formatWeddingDate(siteContent.event.date)}
            </p>
            <p className="mt-3 flex items-baseline justify-center text-center text-text">
              <span className="font-serif text-[1.45rem] tracking-[-0.03em] text-text sm:text-[1.55rem]">
                {formatEventTime(siteContent.event.date, siteContent.event.time)}
              </span>
            </p>
          </div>
        </div>

        <div className="md:hidden">
          <a
            href={createCalendarLink()}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-text px-6 py-4 text-sm font-semibold text-[#fff8f2] transition duration-500 hover:bg-[#4c3f35]"
          >
            Add to Calendar
            <CalendarPlus className="h-4 w-4" />
          </a>
        </div>

        <div className="section-panel rounded-[26px] p-5 sm:p-6">
          <div className="flex items-center gap-3 text-text">
            <MapPinned className="h-5 w-5 text-accent" />
            <p className="luxury-kicker text-muted">Where</p>
          </div>
          <p className="mt-5 text-center text-xl font-normal tracking-[-0.02em] text-muted">
            {siteContent.event.venue}
          </p>
          <p className="balanced-copy mt-3 text-center text-sm leading-7 text-muted">
            {siteContent.event.address}
          </p>
        </div>

        <div className="md:hidden">
          <a
            href={siteContent.links.mapUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-text px-6 py-4 text-sm font-semibold text-[#fff8f2] transition duration-500 hover:bg-[#4c3f35]"
          >
            Open Map
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>

      <div className={`mt-4 hidden gap-3 sm:gap-4 md:grid ${hasDressCode ? "md:grid-cols-[1fr_auto_auto]" : "sm:grid-cols-2 sm:items-start"}`}>
        {hasDressCode ? (
          <div className="section-panel rounded-[26px] p-5 sm:p-6">
            <div className="flex items-center gap-3 text-text">
              <Shirt className="h-5 w-5 text-accent" />
              <p className="luxury-kicker text-muted">Dress Code</p>
            </div>
            <p className="balanced-copy mt-5 text-sm leading-7 text-muted">{siteContent.event.dressCode}</p>
          </div>
        ) : null}

        <div className={hasDressCode ? "md:w-auto" : "w-full sm:justify-self-start"}>
          <a
            href={createCalendarLink()}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-text px-6 py-4 text-sm font-semibold text-[#fff8f2] transition duration-500 hover:bg-[#4c3f35] sm:min-w-[220px] sm:w-auto sm:px-7"
          >
            Add to Calendar
            <CalendarPlus className="h-4 w-4" />
          </a>
        </div>

        <div className={hasDressCode ? "md:w-auto" : "w-full sm:justify-self-start"}>
          <a
            href={siteContent.links.mapUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-text px-6 py-4 text-sm font-semibold text-[#fff8f2] transition duration-500 hover:bg-[#4c3f35] sm:min-w-[200px] sm:w-auto sm:px-7"
          >
            Open Map
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </SectionShell>
  );
}
