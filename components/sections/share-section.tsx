"use client";

import { Mail, MessageCircleMore, Share2 } from "lucide-react";
import { useState } from "react";
import { metaContent } from "@/content/meta";
import { siteContent } from "@/content/site";
import { CopyButton } from "@/components/copy-button";
import { SectionHeading } from "@/components/section-heading";
import { SectionShell } from "@/components/section-shell";

export function ShareSection() {
  const shareUrl = metaContent.siteUrl;
  const [showFallbackOptions, setShowFallbackOptions] = useState(false);
  const shareText = shareUrl;
  const smsHref = `sms:?&body=${encodeURIComponent(shareText)}`;
  const emailHref = `mailto:?subject=${encodeURIComponent(metaContent.ogTitle)}&body=${encodeURIComponent(shareText)}`;

  const handleShare = async () => {
    if (typeof navigator === "undefined") {
      return;
    }

    try {
      const sharePayload = {
        url: shareUrl
      };

      if (navigator.share && (!navigator.canShare || navigator.canShare(sharePayload))) {
        await navigator.share({
          url: sharePayload.url
        });
        setShowFallbackOptions(false);
        return;
      }
    } catch {
      // If the native share sheet is unavailable or dismissed, expose manual share options.
    }

    setShowFallbackOptions((current) => !current);
  };

  return (
    <SectionShell id="share">
      <div className="flex flex-col gap-6">
        <SectionHeading
          eyebrow="Share"
          title="Send this invitation beautifully in one tap."
          description="The copy-link button always works, and Web Share is available on supported mobile browsers."
          align="center"
        />
        <div className="flex flex-wrap justify-center gap-3">
          <CopyButton value={shareUrl} label="Copy Link" />
          <button
            type="button"
            onClick={handleShare}
            className="btn-secondary inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-[15px] font-semibold"
          >
            <Share2 className="h-4 w-4" />
            Share
          </button>
        </div>
      </div>

      {showFallbackOptions ? (
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <a
            href={smsHref}
            className="btn-secondary inline-flex items-center gap-2 rounded-full px-4 py-3 text-[15px] font-semibold transition"
          >
            <MessageCircleMore className="h-4 w-4" />
            Messages
          </a>
          <a
            href={emailHref}
            className="btn-secondary inline-flex items-center gap-2 rounded-full px-4 py-3 text-[15px] font-semibold transition"
          >
            <Mail className="h-4 w-4" />
            Email
          </a>
          <CopyButton value={shareUrl} label="Copy Link" />
        </div>
      ) : null}
    </SectionShell>
  );
}
