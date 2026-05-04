"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { rsvpFormContent } from "@/content/rsvp";
import { cn } from "@/lib/utils";

type Attendance = "Attending" | "Undecided" | "Unable to Attend";
type GuestCount = "1" | "2" | "3";
type Step = "attendance" | "count" | "names" | "note" | "thanks";

const entreeOptions = [
  "NY Strip Steak",
  "Big Eye Tuna with Horta and Roasted Beets",
  "Jumbo Shrimp with moussaka"
] as const;

const appsScriptEndpoint =
  "https://script.google.com/macros/s/AKfycbyE5n5XuZ4c3UakjxFxm1GQ2KFT1uKGTM5tEmaIsvBkpLCVlu7e8cwZqnjP0-hbK76W/exec";

const guestCountOptions: Array<{ value: GuestCount; label: string }> = [
  { value: "1", label: "1 person" },
  { value: "2", label: "2 people" },
  { value: "3", label: "3 people" }
];

function OptionCard({
  selected,
  title,
  description,
  onClick
}: {
  selected: boolean;
  title: string;
  description?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full rounded-[22px] border px-4 py-4 text-left transition active:scale-[0.985]",
        selected
          ? "border-[#b89a80] bg-[#f7efe7] shadow-[0_12px_28px_rgba(92,69,52,0.08)]"
          : "border-line bg-white/70 hover:border-[#cdb9a5] hover:bg-white"
      )}
    >
      <span className="flex items-start justify-between gap-3">
        <span>
          <span className="block font-sans text-[16px] font-semibold tracking-[-0.01em] text-text">{title}</span>
          {description ? (
            <span className="mt-1 block text-[15px] leading-6 text-muted">{description}</span>
          ) : null}
        </span>
        <span
          className={cn(
            "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border",
            selected ? "border-accent bg-accent text-white" : "border-line bg-white text-transparent"
          )}
          aria-hidden="true"
        >
          <Check className="h-3.5 w-3.5" />
        </span>
      </span>
    </button>
  );
}

function TextInput({
  label,
  value,
  onChange,
  autoComplete
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="luxury-kicker block text-muted">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        required
        className="mt-3 h-12 w-full rounded-2xl border border-line bg-white/75 px-4 text-[16px] text-text outline-none transition placeholder:text-muted/55 focus:border-[#b89a80] focus:bg-white focus:shadow-[0_0_0_4px_rgba(184,154,128,0.14)]"
        placeholder="Full name"
      />
    </label>
  );
}

export function CustomRsvpForm() {
  const { copy } = rsvpFormContent;
  const [step, setStep] = useState<Step>("attendance");
  const [attendance, setAttendance] = useState<Attendance | "">("");
  const [guestCount, setGuestCount] = useState<GuestCount | "">("");
  const [guestNames, setGuestNames] = useState(["", "", ""]);
  const [guestEntrees, setGuestEntrees] = useState(["", "", ""]);
  const [message, setMessage] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submittedType, setSubmittedType] = useState<Attendance | "">("");
  const [error, setError] = useState("");

  const requiredNameCount = guestCount ? Number(guestCount) : 0;
  const visibleGuestNames = guestNames.slice(0, requiredNameCount);
  const visibleGuestEntrees = guestEntrees.slice(0, requiredNameCount);
  const namesAreValid = requiredNameCount > 0 && visibleGuestNames.every((name) => name.trim().length > 0);
  const entreesAreValid =
    requiredNameCount > 0 && visibleGuestEntrees.every((entree) => entree.trim().length > 0);

  const resetError = () => setError("");

  const goNextFromAttendance = () => {
    resetError();
    if (attendance === "Attending") {
      setStep("count");
    } else if (attendance === "Undecided" || attendance === "Unable to Attend") {
      setStep("note");
    }
  };

  const submit = async () => {
    resetError();
    setSubmitting(true);

    const entreeSummary =
      attendance === "Attending"
        ? visibleGuestNames
            .map((name, index) => `${name.trim()}: ${visibleGuestEntrees[index]?.trim() ?? ""}`)
            .filter(Boolean)
            .join("\n")
        : "";

    const payload = {
      attending: attendance,
      numberOfGuests: attendance === "Attending" ? guestCount : "",
      guest1Name: attendance === "Attending" ? visibleGuestNames[0]?.trim() ?? "" : "",
      guest2Name: attendance === "Attending" ? visibleGuestNames[1]?.trim() ?? "" : "",
      guest3Name: attendance === "Attending" ? visibleGuestNames[2]?.trim() ?? "" : "",
      reason: attendance === "Undecided" || attendance === "Unable to Attend" ? note.trim() : "",
      message: attendance === "Attending" ? message.trim() : "",
      entrees: entreeSummary,
      ENTREES: entreeSummary,
      source: "us-wedding-site"
    };

    console.log("Submitting RSVP payload:", payload);

    try {
      const response = await fetch(appsScriptEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(payload)
      });
      const result = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok || !result.ok) {
        throw new Error(result.error || copy.errorMessage);
      }

      setSubmittedType(attendance);
      setStep("thanks");
    } catch (submitError) {
      console.error("RSVP submit error:", submitError);
      setError(submitError instanceof Error ? submitError.message : copy.errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const primaryButtonClass =
    "btn-primary inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold transition disabled:pointer-events-none disabled:opacity-45";
  const secondaryButtonClass =
    "btn-secondary inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold transition";

  return (
    <div className="section-card soft-grain overflow-hidden px-5 py-7 sm:px-7 sm:py-8">
      <div className="relative">
        {step !== "thanks" ? (
          <div className="text-center">
            <p className="luxury-kicker text-accent">{copy.title}</p>
            <h1 className="mx-auto mt-4 max-w-[18ch] font-serif text-[clamp(1.9rem,8vw,2.35rem)] font-medium leading-[1.08] tracking-[-0.03em] text-text">
              {step === "attendance"
                ? copy.subtitle
                : step === "count"
                  ? copy.guestCountTitle
                  : step === "names"
                    ? copy.guestNamesTitle
                    : attendance === "Unable to Attend"
                      ? copy.unableToAttendTitle
                      : copy.undecidedTitle}
            </h1>
            <p className="mx-auto mt-4 max-w-[28ch] text-[16px] leading-7 text-muted">
              {step === "attendance"
                ? copy.deadline
                : step === "count"
                  ? copy.guestCountDescription
                  : step === "names"
                    ? copy.guestNamesDescription
                    : attendance === "Unable to Attend"
                      ? copy.unableToAttendNoteDescription
                      : copy.undecidedNoteDescription}
            </p>
          </div>
        ) : null}

        <div className="mt-7 space-y-5">
          {step === "attendance" ? (
            <>
              <p className="rounded-[22px] border border-line bg-white/60 px-4 py-4 text-[15.5px] leading-7 text-muted">
                {copy.intro}
              </p>
              <div>
                <p className="luxury-kicker mb-3 text-muted">{copy.attendanceQuestion}</p>
                <div className="space-y-3">
                  <OptionCard
                    selected={attendance === "Attending"}
                    title={copy.attendingLabel}
                    description={copy.attendingDescription}
                    onClick={() => {
                      setAttendance("Attending");
                      resetError();
                    }}
                  />
                  <OptionCard
                    selected={attendance === "Undecided"}
                    title={copy.undecidedLabel}
                    description={copy.undecidedDescription}
                    onClick={() => {
                      setAttendance("Undecided");
                      resetError();
                    }}
                  />
                  <OptionCard
                    selected={attendance === "Unable to Attend"}
                    title={copy.unableToAttendLabel}
                    description={copy.unableToAttendDescription}
                    onClick={() => {
                      setAttendance("Unable to Attend");
                      resetError();
                    }}
                  />
                </div>
              </div>
              <button type="button" disabled={!attendance} onClick={goNextFromAttendance} className={primaryButtonClass}>
                {copy.next}
                <ArrowRight className="h-4 w-4" />
              </button>
            </>
          ) : null}

          {step === "count" ? (
            <>
              <div>
                <p className="luxury-kicker mb-3 text-muted">{copy.guestCountQuestion}</p>
                <div className="grid gap-3">
                  {guestCountOptions.map((option) => (
                    <OptionCard
                      key={option.value}
                      selected={guestCount === option.value}
                      title={option.label}
                      onClick={() => {
                        setGuestCount(option.value);
                        resetError();
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setStep("attendance")} className={secondaryButtonClass}>
                  <ArrowLeft className="h-4 w-4" />
                  {copy.back}
                </button>
                <button
                  type="button"
                  disabled={!guestCount}
                  onClick={() => {
                    resetError();
                    setStep("names");
                  }}
                  className={primaryButtonClass}
                >
                  {copy.next}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </>
          ) : null}

          {step === "names" ? (
            <>
              <div className="space-y-5">
                {Array.from({ length: requiredNameCount }).map((_, index) => (
                  <div key={index} className="space-y-4">
                    <TextInput
                      label={`Guest ${index + 1} Full Name`}
                      value={guestNames[index] ?? ""}
                      autoComplete={index === 0 ? "name" : undefined}
                      onChange={(value) => {
                        setGuestNames((current) => {
                          const next = [...current];
                          next[index] = value;
                          return next;
                        });
                        resetError();
                      }}
                    />
                    <label className="block">
                      <span className="luxury-kicker block text-muted">
                        {copy.entreeLabel} for Guest {index + 1}
                      </span>
                      <select
                        value={guestEntrees[index] ?? ""}
                        onChange={(event) => {
                          setGuestEntrees((current) => {
                            const next = [...current];
                            next[index] = event.target.value;
                            return next;
                          });
                          resetError();
                        }}
                        required
                        className="mt-3 h-12 w-full rounded-2xl border border-line bg-white/75 px-4 text-[16px] text-text outline-none transition focus:border-[#b89a80] focus:bg-white focus:shadow-[0_0_0_4px_rgba(184,154,128,0.14)]"
                      >
                        <option value="">{copy.entreePlaceholder}</option>
                        {entreeOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                ))}
                <label className="block">
                  <span className="luxury-kicker block text-muted">{copy.messageLabel}</span>
                  <p className="mt-2 text-[14px] leading-6 text-muted">{copy.messageHelperText}</p>
                  <textarea
                    value={message}
                    onChange={(event) => {
                      setMessage(event.target.value);
                      resetError();
                    }}
                    rows={4}
                    className="mt-3 min-h-28 w-full resize-none rounded-[22px] border border-line bg-white/75 px-4 py-4 text-[16px] leading-7 text-text outline-none transition placeholder:text-muted/55 focus:border-[#b89a80] focus:bg-white focus:shadow-[0_0_0_4px_rgba(184,154,128,0.14)]"
                    placeholder="Optional message"
                  />
                </label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" disabled={submitting} onClick={() => setStep("count")} className={secondaryButtonClass}>
                  <ArrowLeft className="h-4 w-4" />
                  {copy.back}
                </button>
                <button
                  type="button"
                  disabled={!namesAreValid || !entreesAreValid || submitting}
                  onClick={() => {
                    if (!entreesAreValid) {
                      setError(copy.entreeValidationMessage);
                      return;
                    }
                    submit();
                  }}
                  className={primaryButtonClass}
                >
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {copy.submitRsvp}
                </button>
              </div>
            </>
          ) : null}

          {step === "note" ? (
            <>
              <label className="block">
                <span className="luxury-kicker block text-muted">{copy.noteLabel}</span>
                <textarea
                  value={note}
                  onChange={(event) => {
                    setNote(event.target.value);
                    resetError();
                  }}
                  required
                  rows={5}
                  className="mt-3 min-h-32 w-full resize-none rounded-[22px] border border-line bg-white/75 px-4 py-4 text-[16px] leading-7 text-text outline-none transition placeholder:text-muted/55 focus:border-[#b89a80] focus:bg-white focus:shadow-[0_0_0_4px_rgba(184,154,128,0.14)]"
                  placeholder="Leave a short note"
                />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" disabled={submitting} onClick={() => setStep("attendance")} className={secondaryButtonClass}>
                  <ArrowLeft className="h-4 w-4" />
                  {copy.back}
                </button>
                <button type="button" disabled={!note.trim() || submitting} onClick={submit} className={primaryButtonClass}>
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {copy.submitResponse}
                </button>
              </div>
            </>
          ) : null}

          {step === "thanks" ? (
            <div className="py-4 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f7efe7] text-accent">
                <Check className="h-6 w-6" />
              </div>
              <h1 className="mx-auto mt-5 max-w-[18ch] font-serif text-[clamp(2rem,8vw,2.45rem)] font-medium leading-[1.08] tracking-[-0.03em] text-text">
                {submittedType === "Attending" ? copy.attendingThankYouTitle : copy.undecidedThankYouTitle}
              </h1>
              <p className="mx-auto mt-4 max-w-[28ch] text-[16px] leading-7 text-muted">
                {submittedType === "Attending" ? copy.attendingThankYouMessage : copy.undecidedThankYouMessage}
              </p>
              <Link href="/" className={cn(primaryButtonClass, "mt-8")}>
                {copy.backToInvitation}
              </Link>
            </div>
          ) : null}

          {error ? (
            <p className="rounded-2xl border border-[#c75c44]/20 bg-[#fff5f1] px-4 py-3 text-center text-[15px] leading-6 text-[#9a3f2d]">
              {error}
            </p>
          ) : null}
        </div>

      </div>
    </div>
  );
}
