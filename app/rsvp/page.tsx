import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CustomRsvpForm } from "@/components/rsvp/custom-rsvp-form";

export const metadata: Metadata = {
  title: "RSVP | Sejin Shin & Shinhye Kim",
  description: "RSVP for Sejin Shin and Shinhye Kim's wedding luncheon."
};

export default function RsvpPage() {
  return (
    <main className="mx-auto flex min-h-[100svh] w-full max-w-[430px] flex-col px-3 py-4 text-text sm:px-4">
      <div className="mb-4">
        <Link
          href="/"
          className="btn-secondary inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 py-2 text-[14px] font-semibold transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Invitation
        </Link>
      </div>
      <CustomRsvpForm />
    </main>
  );
}
