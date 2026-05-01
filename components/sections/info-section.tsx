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
      <SectionHeading eyebrow="Details" title="" description="" align="center" />
      <p className="mx-auto max-w-full text-center text-[clamp(15.5px,4vw,16.5px)] leading-[1.75] tracking-[-0.01em] text-muted">
        {siteContent.event.note}
      </p>
      <div className="mt-8 grid gap-4">
        <div className="section-panel rounded-[26px] p-5 sm:p-6">
          <div className="flex items-center gap-3 text-text">
            <Clock3 className="h-5 w-5 text-accent" />
            <p className="luxury-kicker text-muted">When</p>
          </div>
          <div className="mt-5 text-center">
            <p className="text-[1.06rem] leading-[1.55] tracking-[-0.015em] text-muted sm:text-[1.14rem]">
              <span className="block balanced-copy">
                {formatWeddingDate(siteContent.event.date)}
              </span>
              <span className="mt-1 block whitespace-nowrap">
                at {formatEventTime(siteContent.event.date, siteContent.event.time)}
              </span>
            </p>
          </div>
        </div>

        <div>
          <a
            href={createCalendarLink()}
            target="_blank"
            rel="noreferrer"
            aria-label="Add wedding luncheon to calendar"
            className="btn-secondary inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[15px] font-semibold transition"
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
          <p className="balanced-copy mx-auto mt-5 max-w-[18rem] text-center text-[1.18rem] font-normal leading-[1.35] tracking-[-0.015em] text-muted sm:text-[1.32rem]">
            {siteContent.event.venue}
          </p>
          <div className="mt-4 text-center">
            <p className="balanced-copy mx-auto max-w-[18rem] text-[1rem] leading-[1.65] tracking-[-0.01em] text-muted sm:text-[1.05rem]">
              {siteContent.event.address}
            </p>
          </div>
        </div>

        <div>
          <a
            href={siteContent.links.mapUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open map for ${siteContent.event.venue}`}
            className="btn-secondary inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[15px] font-semibold transition"
          >
            Open Map
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:gap-4">
        {hasDressCode ? (
          <div className="section-panel rounded-[26px] p-5 sm:p-6">
            <div className="flex items-center gap-3 text-text">
              <Shirt className="h-5 w-5 text-accent" />
              <p className="luxury-kicker text-muted">Dress Code</p>
            </div>
            <p className="balanced-copy mt-5 text-sm leading-7 text-muted">{siteContent.event.dressCode}</p>
          </div>
        ) : null}

        <div className="hidden">
          <a
            href={createCalendarLink()}
            target="_blank"
            rel="noreferrer"
            className="btn-secondary inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[15px] font-semibold transition sm:min-w-[220px] sm:w-auto sm:px-7"
          >
            Add to Calendar
            <CalendarPlus className="h-4 w-4" />
          </a>
        </div>

        <div className="hidden">
          <a
            href={siteContent.links.mapUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-secondary inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[15px] font-semibold transition sm:min-w-[200px] sm:w-auto sm:px-7"
          >
            Open Map
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </SectionShell>
  );
}
