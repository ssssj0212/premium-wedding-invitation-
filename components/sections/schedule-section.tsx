import { ScheduleItem } from "@/content/schedule";
import { SectionHeading } from "@/components/section-heading";
import { SectionShell } from "@/components/section-shell";

type ScheduleSectionProps = {
  items: ScheduleItem[];
};

export function ScheduleSection({ items }: ScheduleSectionProps) {
  return (
    <SectionShell id="schedule">
      <SectionHeading
        eyebrow="Timeline"
        title="A relaxed flow for the day."
        description="Lunch, photographs, and celebration through the afternoon."
      />
      <div className="mt-8 space-y-4">
        {items.map((item, index) => (
          <div
            key={`${item.time}-${item.title}`}
            className="grid gap-4 rounded-[24px] border border-[rgba(88,74,64,0.08)] bg-[rgba(255,252,248,0.8)] p-5"
          >
            <div className="rounded-[18px] bg-[rgba(184,143,115,0.10)] px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-accent">Time</p>
              <p className="mt-2 whitespace-nowrap font-serif text-[clamp(1.04rem,4.8vw,1.16rem)] leading-tight tracking-[-0.02em] text-text">
                {item.time}
              </p>
            </div>
            <div className={index === items.length - 1 ? "" : "border-t border-line/60 pt-4 sm:border-none sm:pt-0"}>
              <p className="text-lg font-semibold tracking-[-0.02em] text-text">{item.title}</p>
              <p className="mt-2 text-sm leading-7 text-muted">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
