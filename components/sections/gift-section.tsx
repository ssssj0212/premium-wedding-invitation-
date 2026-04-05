"use client";

import { ChevronDown, Landmark } from "lucide-react";
import { useState } from "react";
import { AccountGroup, accountsContent } from "@/content/accounts";
import { siteContent } from "@/content/site";
import { CopyButton } from "@/components/copy-button";
import { SectionHeading } from "@/components/section-heading";
import { SectionShell } from "@/components/section-shell";

function GroupCard({
  group,
  open,
  onToggle
}: {
  group: AccountGroup;
  open: boolean;
  onToggle: () => void;
}) {
  const canCollapse = group.collapsible;

  return (
    <div className="overflow-hidden rounded-[28px] border border-[rgba(88,74,64,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(250,244,238,0.62))] shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]">
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="luxury-kicker text-accent">{group.sideLabel}</p>
            <h3 className="mt-3 font-serif text-[1.9rem] leading-none tracking-[-0.04em] text-text">
              {group.title}
            </h3>
            {group.description ? (
              <p className="balanced-copy mt-3 max-w-xl text-sm leading-7 text-muted">
                {group.description}
              </p>
            ) : null}
          </div>
          {canCollapse ? (
            <button
              type="button"
              onClick={onToggle}
              className="inline-flex items-center gap-2 rounded-full border border-[rgba(88,74,64,0.08)] bg-white/75 px-4 py-3 text-sm font-semibold text-text transition duration-500 hover:border-accent/40 hover:text-accent"
              aria-expanded={open}
            >
              {open ? "Hide" : "Show"}
              <ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} />
            </button>
          ) : (
            <div className="rounded-full bg-[rgba(184,143,115,0.12)] p-3 text-accent">
              <Landmark className="h-4 w-4" />
            </div>
          )}
        </div>

        {open ? (
          <div className="mt-6 space-y-4">
            {group.entries.map((entry) => (
              <div
                key={`${group.id}-${entry.bankName}-${entry.accountNumber}`}
                className="rounded-[24px] border border-[rgba(88,74,64,0.08)] bg-[rgba(255,252,248,0.72)] p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="luxury-kicker text-accent">{entry.label}</p>
                    <p className="mt-4 text-lg font-semibold tracking-[-0.02em] text-text">
                      {entry.accountHolder}
                    </p>
                  </div>
                  <div className="rounded-full bg-[rgba(184,143,115,0.12)] p-3 text-accent">
                    <Landmark className="h-4 w-4" />
                  </div>
                </div>

                <div className="editorial-divider mt-5 pt-5">
                  <p className="text-xs uppercase tracking-[0.22em] text-muted">{entry.bankName}</p>
                  <p className="mt-3 break-all font-serif text-[1.55rem] leading-tight tracking-[0.01em] text-text sm:text-[1.75rem]">
                    {entry.accountNumber}
                  </p>
                </div>

                {entry.note ? (
                  <p className="balanced-copy mt-4 text-sm leading-7 text-muted">{entry.note}</p>
                ) : null}

                <div className="mt-5 flex flex-wrap gap-3">
                  <CopyButton value={entry.accountNumber} label="Copy Number" />
                  <CopyButton
                    value={`${entry.bankName} ${entry.accountNumber} ${entry.accountHolder}`}
                    label="Copy All"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function GiftSection() {
  const [sectionOpen, setSectionOpen] = useState(siteContent.features.expandGiftSectionByDefault);
  const [groupState, setGroupState] = useState<Record<string, boolean>>(
    Object.fromEntries(accountsContent.groups.map((group) => [group.id, group.defaultOpen]))
  );

  return (
    <SectionShell
      id="gift"
      className="bg-[linear-gradient(180deg,rgba(255,250,246,0.96),rgba(249,242,235,0.93))]"
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          eyebrow="Gift Information"
          title={accountsContent.title}
          description={accountsContent.description}
        />
        <button
          type="button"
          onClick={() => setSectionOpen((prev) => !prev)}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-[rgba(88,74,64,0.08)] bg-white/75 px-4 py-3 text-sm font-semibold text-text transition duration-500 hover:border-accent/40 hover:text-accent"
          aria-expanded={sectionOpen}
        >
          {sectionOpen ? "Hide account details" : "Show account details"}
          <ChevronDown className={`h-4 w-4 transition ${sectionOpen ? "rotate-180" : ""}`} />
        </button>
      </div>

      <div className="mt-8 rounded-[28px] border border-[rgba(88,74,64,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.52),rgba(255,251,247,0.2))] p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[rgba(184,143,115,0.12)] text-accent">
            <Landmark className="h-5 w-5" />
          </div>
          <div className="max-w-2xl">
            <p className="luxury-kicker text-accent">{accountsContent.introEyebrow}</p>
            <p className="balanced-copy mt-3 text-sm leading-7 text-muted">{accountsContent.introNote}</p>
          </div>
        </div>
      </div>

      {sectionOpen ? (
        <div className="mt-6 grid gap-4">
          {accountsContent.groups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              open={group.collapsible ? !!groupState[group.id] : true}
              onToggle={() =>
                setGroupState((prev) => ({
                  ...prev,
                  [group.id]: !prev[group.id]
                }))
              }
            />
          ))}
        </div>
      ) : null}
    </SectionShell>
  );
}
