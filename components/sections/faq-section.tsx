"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { FAQItem } from "@/content/faq";
import { SectionHeading } from "@/components/section-heading";
import { SectionShell } from "@/components/section-shell";

type FaqSectionProps = {
  items: FAQItem[];
};

export function FaqSection({ items }: FaqSectionProps) {
  const [openItem, setOpenItem] = useState(0);

  return (
    <SectionShell id="faq">
      <SectionHeading
        eyebrow="FAQ"
        title="Helpful notes before the celebration."
        description="Hide this section automatically by clearing the FAQ items later."
      />
      <div className="mt-8 space-y-3">
        {items.map((item, index) => {
          const open = openItem === index;

          return (
            <div key={item.question} className="overflow-hidden rounded-[24px] border border-line/80 bg-white/75">
              <button
                type="button"
                onClick={() => setOpenItem(open ? -1 : index)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="text-sm font-semibold text-text sm:text-base">{item.question}</span>
                <ChevronDown className={`h-4 w-4 shrink-0 text-accent transition ${open ? "rotate-180" : ""}`} />
              </button>
              {open ? <p className="border-t border-line/70 px-5 py-4 text-sm leading-7 text-muted">{item.answer}</p> : null}
            </div>
          );
        })}
      </div>
    </SectionShell>
  );
}
