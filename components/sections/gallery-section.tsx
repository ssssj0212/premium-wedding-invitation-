"use client";
/* eslint-disable @next/next/no-img-element */

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { PhotoItem } from "@/content/photos";
import { SectionHeading } from "@/components/section-heading";
import { SectionShell } from "@/components/section-shell";

type GallerySectionProps = {
  photos: PhotoItem[];
};

const THUMBS_PER_PAGE = 4;

export function GallerySection({ photos }: GallerySectionProps) {
  const safePhotos = useMemo(
    () => (photos.length ? photos : [{ src: "", alt: "Wedding gallery image" }]),
    [photos]
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [page, setPage] = useState(0);

  const totalPages = Math.max(1, Math.ceil(safePhotos.length / THUMBS_PER_PAGE));
  const currentActiveIndex = Math.min(activeIndex, safePhotos.length - 1);
  const currentPage = Math.min(page, totalPages - 1);

  const visibleThumbs = useMemo(() => {
    const start = currentPage * THUMBS_PER_PAGE;
    return safePhotos.slice(start, start + THUMBS_PER_PAGE).map((photo, index) => ({
      photo,
      index: start + index
    }));
  }, [currentPage, safePhotos]);

  const activePhoto = safePhotos[currentActiveIndex] ?? safePhotos[0];

  const handleSelect = (index: number) => {
    setActiveIndex(index);
    setPage(Math.floor(index / THUMBS_PER_PAGE));
  };

  const goPrev = () => {
    setPage((current) => Math.max(0, current - 1));
  };

  const goNext = () => {
    setPage((current) => Math.min(totalPages - 1, current + 1));
  };

  const isPrevDisabled = currentPage === 0;
  const isNextDisabled = currentPage === totalPages - 1;

  return (
    <SectionShell id="gallery">
      <SectionHeading
        eyebrow="Gallery"
        title="A few frames from our season together."
        description=""
        align="center"
      />

      <div className="mt-8 grid gap-4 lg:grid-cols-[1.02fr_0.98fr] lg:items-stretch">
        <motion.button
          key={activePhoto.src || `${currentActiveIndex}`}
          type="button"
          initial={{ opacity: 0.75, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="group relative mx-auto w-fit max-w-full overflow-hidden rounded-[30px] border border-[rgba(88,74,64,0.08)] bg-[linear-gradient(180deg,rgba(255,253,250,0.98),rgba(244,236,228,0.96))] p-1.5 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]"
        >
          <div className="flex min-h-[340px] items-center justify-center sm:min-h-[430px] lg:min-h-[540px]">
            <img
              src={activePhoto.src}
              alt={activePhoto.alt}
              className="block h-auto max-h-[calc(340px-1.5rem)] w-auto max-w-full rounded-[24px] object-contain sm:max-h-[calc(430px-1.5rem)] lg:max-h-[calc(540px-1.5rem)]"
              loading="eager"
              decoding="async"
            />
          </div>
        </motion.button>

        <div className="flex min-h-full flex-col gap-4">
          <div className="grid grid-cols-2 gap-3 lg:flex-1">
            {visibleThumbs.map(({ photo, index }) => {
              const isActive = index === currentActiveIndex;

              return (
                <motion.button
                  key={`${photo.src}-${index}`}
                  type="button"
                  onClick={() => handleSelect(index)}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className={`relative mx-auto w-fit max-w-full overflow-hidden rounded-[24px] border bg-[linear-gradient(180deg,rgba(255,253,250,0.98),rgba(244,236,228,0.94))] p-1 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] ${
                    isActive
                      ? "border-[rgba(184,143,115,0.55)] shadow-[0_18px_30px_rgba(91,67,49,0.12)]"
                      : "border-[rgba(88,74,64,0.08)]"
                  }`}
                >
                  <div className="flex min-h-[165px] items-center justify-center sm:min-h-[195px] lg:min-h-[240px]">
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      className="block h-auto max-h-[calc(165px-1rem)] w-auto max-w-full rounded-[18px] object-contain sm:max-h-[calc(195px-1rem)] lg:max-h-[calc(240px-1rem)]"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div
                    className={`pointer-events-none absolute inset-0 transition duration-300 ${
                      isActive
                        ? "bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(23,18,14,0.18))]"
                        : "bg-[linear-gradient(180deg,rgba(255,255,255,0),rgba(23,18,14,0.06))]"
                    }`}
                  />
                </motion.button>
              );
            })}
          </div>

          {safePhotos.length > THUMBS_PER_PAGE ? (
            <div className="flex items-center justify-between rounded-[22px] border border-[rgba(88,74,64,0.08)] bg-white/75 px-4 py-3">
              <button
                type="button"
                onClick={goPrev}
                disabled={isPrevDisabled}
                className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition ${
                  isPrevDisabled
                    ? "cursor-default text-muted/45"
                    : "text-text hover:text-accent"
                }`}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>
              <p className="text-[11px] uppercase tracking-[0.26em] text-muted">
                {currentPage + 1} of {totalPages}
              </p>
              <button
                type="button"
                onClick={goNext}
                disabled={isNextDisabled}
                className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition ${
                  isNextDisabled
                    ? "cursor-default text-muted/45"
                    : "text-text hover:text-accent"
                }`}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </SectionShell>
  );
}
