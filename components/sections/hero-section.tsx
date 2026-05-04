"use client";

import { motion } from "framer-motion";
import { Montserrat, WindSong } from "next/font/google";
import { siteContent } from "@/content/site";
import { heroPhoto } from "@/content/photos";
import { formatEventTime, formatWeddingDate } from "@/lib/date";
import { ImageCard } from "@/components/image-card";

const windsong = WindSong({
  subsets: ["latin"],
  weight: "400"
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: "300"
});

const heroFadeMask =
  "[mask-image:linear-gradient(to_bottom,black_0%,black_87%,rgba(0,0,0,0.985)_90%,rgba(0,0,0,0.86)_93%,rgba(0,0,0,0.58)_96%,rgba(0,0,0,0.24)_98%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_87%,rgba(0,0,0,0.985)_90%,rgba(0,0,0,0.86)_93%,rgba(0,0,0,0.58)_96%,rgba(0,0,0,0.24)_98%,transparent_100%)]";

export function HeroSection() {
  const dateTimeLine = `${formatWeddingDate(siteContent.event.date)} at ${formatEventTime(
    siteContent.event.date,
    siteContent.event.time
  )}`;

  return (
    <section
      id="home"
      className="section-card relative overflow-hidden px-4 pb-5 pt-4 sm:px-6 sm:pb-7 sm:pt-6"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-10 top-10 h-32 w-32 rounded-full bg-[#f6e7d9]/50 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-40 w-40 rounded-full bg-[#efe0d2]/45 blur-3xl" />
      </div>

      <div className="relative grid gap-0">
        <motion.div
          initial={false}
          className="hero-light-leak relative aspect-[2/3] overflow-hidden rounded-t-[30px] rounded-b-none"
        >
          <ImageCard
            src={heroPhoto?.src ?? ""}
            alt={heroPhoto?.alt ?? "Wedding hero image"}
            priority
            className={`h-full min-h-0 rounded-t-[30px] rounded-b-none bg-transparent ${heroFadeMask}`}
            imageClassName={`hero-photo-reveal object-contain object-center ${heroFadeMask}`}
            sizes="(max-width: 430px) calc(100vw - 2rem), 398px"
            fallbackMode="minimal"
          />
          <div
            className={`pointer-events-none absolute inset-0 z-[1] rounded-t-[30px] rounded-b-none bg-[linear-gradient(180deg,rgba(255,250,244,0.1),rgba(246,232,219,0.08)_48%,rgba(255,255,255,0.04))] ${heroFadeMask}`}
            aria-hidden="true"
          />

          <div className="hero-petals" aria-hidden="true">
            {Array.from({ length: 7 }).map((_, index) => (
              <span key={index} className={`hero-petal hero-petal-${index + 1}`} />
            ))}
          </div>

          <div className="absolute inset-x-0 top-4 z-10 flex justify-center px-8 text-center text-[#fdf8f3] sm:top-8">
            <p
              className={`${montserrat.className} text-[9.8px] font-light uppercase tracking-[0.5em] text-[#eadfd1]/96`}
            >
                WEDDING INVITATION
            </p>
          </div>

          <div className="pointer-events-none absolute inset-x-0 top-[10.9%] z-10 flex justify-center px-6 text-center text-white">
            <p
              className={`${windsong.className} w-full max-w-[16.35rem] whitespace-pre-line text-[clamp(3.58rem,15.4vw,5.02rem)] font-normal leading-[0.7] tracking-[-0.012em] [text-shadow:0_1px_10px_rgba(0,0,0,0.04)]`}
            >
              {"Our\nWedding\nDay"}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.15, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 mx-auto mt-1 w-full max-w-[17.25rem] px-3 pb-4 pt-0 text-center"
        >
          <div className="mx-auto grid max-w-[16.15rem] grid-cols-2 items-baseline justify-items-center gap-x-4">
            <div className="inline-flex items-baseline justify-center gap-[0.45rem] whitespace-nowrap">
              <span className="text-[clamp(0.64rem,1.95vw,0.7rem)] font-medium tracking-[0.07em] text-[#8a7969]">
                Groom
              </span>
              <span className="font-serif text-[clamp(0.94rem,2.85vw,1.04rem)] font-medium tracking-[-0.018em] text-[#6c5b4d]">
                {siteContent.couple.groomName}
              </span>
            </div>
            <div className="inline-flex items-baseline justify-center gap-[0.45rem] whitespace-nowrap">
              <span className="text-[clamp(0.64rem,1.95vw,0.7rem)] font-medium tracking-[0.07em] text-[#8a7969]">
                Bride
              </span>
              <span className="font-serif text-[clamp(0.94rem,2.85vw,1.04rem)] font-medium tracking-[-0.018em] text-[#6c5b4d]">
                {siteContent.couple.brideName}
              </span>
            </div>
          </div>
          <div className="mx-auto mt-3 h-px w-5 bg-[linear-gradient(90deg,transparent,rgba(181,150,114,0.34),transparent)]" />
          <div className="mt-2.5 space-y-[0.18rem] text-center text-[#7d6b5c]">
            <p className="whitespace-nowrap font-medium tracking-[0.028em] text-[clamp(0.67rem,1.9vw,0.73rem)]">
              {dateTimeLine}
            </p>
            <p className="font-serif text-[clamp(0.78rem,2.35vw,0.86rem)] font-medium tracking-[-0.012em] text-[#6c5b4d]">
              {siteContent.event.venue}
            </p>
            <p className="whitespace-nowrap text-[clamp(0.62rem,1.85vw,0.68rem)] tracking-[0.008em]">
              {siteContent.event.address}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
