"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { siteContent } from "@/content/site";
import { heroPhoto } from "@/content/photos";
import { formatEventTime, formatWeddingDate } from "@/lib/date";
import { ImageCard } from "@/components/image-card";

export function HeroSection() {
  return (
    <section className="section-card relative overflow-hidden px-4 pb-4 pt-4 sm:px-6 sm:pb-6 sm:pt-6">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-10 top-10 h-32 w-32 rounded-full bg-[#f6e7d9]/50 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-40 w-40 rounded-full bg-[#efe0d2]/45 blur-3xl" />
      </div>

      <div className="relative grid gap-4 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative aspect-[4/5] overflow-hidden rounded-[30px] border border-white/50 sm:aspect-[5/6] lg:aspect-auto lg:min-h-[72svh] [@media_(orientation:landscape)_and_(max-height:560px)]:aspect-[16/10] [@media_(orientation:landscape)_and_(max-height:560px)]:min-h-0"
        >
          <ImageCard
            src={heroPhoto?.src ?? ""}
            alt={heroPhoto?.alt ?? "Wedding hero image"}
            priority
            className="h-full min-h-0 rounded-[30px] lg:min-h-[72svh] [@media_(orientation:landscape)_and_(max-height:560px)]:min-h-0"
            sizes="100vw"
            fallbackMode="minimal"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(19,14,10,0.08),rgba(23,18,14,0.18)_28%,rgba(40,28,20,0.58)_100%)]" />

          <div className="absolute inset-x-0 top-0 flex justify-start p-4 text-[#fdf5ef] sm:p-7">
            <div className="max-w-[220px] rounded-full border border-white/25 bg-black/10 px-3 py-1.5 backdrop-blur-sm sm:max-w-none sm:px-4 sm:py-2">
              <p className="text-[9px] uppercase tracking-[0.24em] text-[#f5e4d8] sm:luxury-kicker">
                Post-Wedding Celebration
              </p>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 p-4 text-[#fff9f4] sm:p-8">
            <h1 className="max-w-[10ch] font-serif leading-[0.94] tracking-[-0.045em] text-[clamp(1.85rem,8.2vmin,4.75rem)] sm:max-w-[12ch] sm:leading-[0.88] sm:tracking-[-0.05em] lg:text-[clamp(3.6rem,6vw,5.1rem)]">
              <span className="block">{siteContent.couple.groomName}</span>
              <span className="my-1 block text-[0.5em] leading-none text-[#f2ddd0]">&amp;</span>
              <span className="block">{siteContent.couple.brideName}</span>
            </h1>
            {siteContent.hero.subtitle ? (
              <div className="mt-4 max-w-[22rem] border-l border-white/25 pl-4 sm:mt-5 sm:max-w-md">
                <p className="balanced-copy text-[14px] leading-6 text-[#f8eee6] sm:text-base sm:leading-8">
                  {siteContent.hero.subtitle}
                </p>
              </div>
            ) : null}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.95, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex flex-col justify-between overflow-hidden rounded-[30px] border border-[rgba(88,74,64,0.08)] bg-[linear-gradient(180deg,rgba(255,252,248,0.95),rgba(247,239,232,0.9))] p-6 sm:p-8"
        >
          <div className="absolute inset-x-8 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(184,143,115,0.45),transparent)]" />
          <div className="max-w-none">
            <p className="luxury-kicker text-accent">Saturday Wedding Lunch</p>
            <p className="balanced-copy mt-5 font-serif text-[15px] leading-7 tracking-[-0.02em] text-text sm:text-[17px] sm:leading-8">
              {siteContent.hero.invitationLine}
            </p>
          </div>

          <div className="my-9 space-y-6">
            <div className="editorial-divider pt-6">
              <p className="luxury-kicker text-muted">Date & Time</p>
              <p className="balanced-copy editorial-body mt-3">
                {formatWeddingDate(siteContent.event.date)} at{" "}
                {formatEventTime(siteContent.event.date, siteContent.event.time)}
              </p>
            </div>
            <div className="editorial-divider pt-6">
              <p className="luxury-kicker text-muted">Venue</p>
              <p className="mt-3 text-lg font-semibold tracking-[-0.02em] text-text">
                {siteContent.event.venue}
              </p>
              <div className="mt-3 flex items-start gap-2">
                <MapPin className="mt-2 h-4 w-4 shrink-0 text-accent" />
                <p className="balanced-copy editorial-body">{siteContent.event.address}</p>
              </div>
            </div>
          </div>

          <div className="pt-2" />
        </motion.div>
      </div>
    </section>
  );
}
