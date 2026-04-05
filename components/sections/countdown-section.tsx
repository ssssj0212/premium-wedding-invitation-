"use client";

import { useMemo, useSyncExternalStore } from "react";
import { siteContent } from "@/content/site";
import { getCountdownParts } from "@/lib/date";
import { SectionHeading } from "@/components/section-heading";
import { SectionShell } from "@/components/section-shell";

function subscribe(callback: () => void) {
  const timer = window.setInterval(callback, 1000);
  return () => window.clearInterval(timer);
}

function getSnapshot() {
  return Date.now();
}

function getServerSnapshot() {
  return 0;
}

export function CountdownSection() {
  const now = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const countdown = useMemo(() => getCountdownParts(siteContent.event.date, siteContent.event.time, now), [now]);

  return (
    <SectionShell id="countdown" className="overflow-hidden">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          eyebrow="Countdown"
          title={countdown.isPast ? "The celebration has begun." : "Counting down to our wedding day."}
          description={siteContent.countdown.message}
          align="center"
        />
        <div className="mt-8 grid grid-cols-4 gap-3">
          {countdown.parts.map((part) => (
            <div
              key={part.label}
              className="rounded-[24px] border border-line/80 bg-white/80 px-4 py-5 text-center"
            >
              <p className="font-serif text-4xl leading-none text-text sm:text-5xl">{part.value}</p>
              <p className="mt-2 text-[11px] uppercase tracking-[0.24em] text-muted">{part.label}</p>
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
