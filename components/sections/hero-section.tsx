"use client";

import { motion } from "framer-motion";
import { Clock3, MapPin } from "lucide-react";
import { WindSong } from "next/font/google";
import { siteContent } from "@/content/site";
import { heroPhoto } from "@/content/photos";
import { formatEventTime, formatWeddingDate } from "@/lib/date";
import { ImageCard } from "@/components/image-card";

const windsong = WindSong({
  subsets: ["latin"],
  weight: "400"
});

export function HeroSection() {
  return (
    <section
      id="home"
      className="section-card relative overflow-hidden px-4 pb-4 pt-4 sm:px-6 sm:pb-6 sm:pt-6"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-10 top-10 h-32 w-32 rounded-full bg-[#f6e7d9]/50 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-40 w-40 rounded-full bg-[#efe0d2]/45 blur-3xl" />
      </div>

      <div className="relative space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="hero-light-leak relative aspect-[2/3] overflow-hidden rounded-[30px] border border-white/50"
        >
          <ImageCard
            src={heroPhoto?.src ?? ""}
            alt={heroPhoto?.alt ?? "Wedding hero image"}
            priority
            className="h-full min-h-0 rounded-[30px] bg-transparent"
            imageClassName="hero-photo-reveal object-contain object-center brightness-100 saturate-100 contrast-100"
            sizes="(max-width: 430px) calc(100vw - 2rem), 398px"
            fallbackMode="minimal"
          />
          <div className="absolute inset-x-0 bottom-0 h-[34%] bg-[linear-gradient(180deg,rgba(16,12,9,0)_0%,rgba(16,12,9,0.08)_38%,rgba(16,12,9,0.24)_100%)]" />

          <div className="hero-petals" aria-hidden="true">
            {Array.from({ length: 7 }).map((_, index) => (
              <span key={index} className={`hero-petal hero-petal-${index + 1}`} />
            ))}
          </div>

          <div className="absolute inset-x-0 top-0 flex justify-start p-4 text-[#fdf5ef] sm:p-7">
            <div className="max-w-[220px] rounded-full border border-white/30 bg-white/10 px-3 py-1.5 backdrop-blur-[3px] sm:max-w-none sm:px-4 sm:py-2">
              <p className="text-[9px] uppercase tracking-[0.24em] text-white sm:luxury-kicker">
                Wedding Invitation
              </p>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-x-0 top-[24%] flex justify-center px-6 text-center text-white">
            <p
              className={`${windsong.className} w-full max-w-[18rem] whitespace-pre-line text-[clamp(2.82rem,12.1vw,4.12rem)] font-normal leading-[0.74] [text-shadow:0_2px_10px_rgba(0,0,0,0.08)]`}
            >
              {"Our\nWedding\nDay"}
            </p>
          </div>

          <div className="absolute inset-x-0 bottom-0 p-4 text-[#fff9f4] sm:p-8">
            <h1 className="max-w-[13ch] text-balance font-serif text-[clamp(1.92rem,9vw,2.5rem)] font-medium leading-[0.98] tracking-[-0.04em] sm:max-w-[20ch] sm:tracking-[-0.045em]">
              <span className="block">{siteContent.couple.groomName}</span>
              <span className="mt-1 block">
                <span className="mr-2 inline text-[0.56em] leading-none text-[#f2ddd0]">&amp;</span>
                <span className="inline">{siteContent.couple.brideName}</span>
              </span>
            </h1>
            <p className="mt-4 max-w-[28rem] text-[15px] leading-7 text-[#f8eee6] sm:text-[16px]">
              {siteContent.hero.invitationLine}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.15, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[30px] border border-[rgba(88,74,64,0.08)] bg-[linear-gradient(180deg,rgba(255,252,248,0.95),rgba(247,239,232,0.9))] p-6 sm:p-8"
        >
          <div className="absolute inset-x-8 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(184,143,115,0.45),transparent)]" />
          <div className="space-y-6">
            <div className="editorial-divider pt-2">
              <p className="luxury-kicker text-muted">Date & Time</p>
              <div className="mt-3 flex items-start gap-2">
                <Clock3 className="mt-2 h-4 w-4 shrink-0 text-accent" />
                <p className="balanced-copy editorial-body">
                  {formatWeddingDate(siteContent.event.date)} at{" "}
                  {formatEventTime(siteContent.event.date, siteContent.event.time)}
                </p>
              </div>
            </div>
            <div className="editorial-divider pt-6">
              <p className="luxury-kicker text-muted">Venue</p>
              <p className="mt-3 text-base font-normal tracking-[-0.01em] text-text">
                {siteContent.event.venue}
              </p>
              <div className="mt-3 flex items-start gap-2">
                <MapPin className="mt-2 h-4 w-4 shrink-0 text-accent" />
                <p className="balanced-copy editorial-body">{siteContent.event.address}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
