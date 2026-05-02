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
    () =>
      photos.length
        ? photos
        : [{ src: "", alt: "Wedding gallery image", width: 1, height: 1 }],
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
        title=""
        description=""
        align="center"
      />

      <div className="mt-8 grid gap-4">
        <motion.div
          key={activePhoto.src || `${currentActiveIndex}`}
          initial={{ opacity: 0.76, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
          className="group relative overflow-hidden rounded-[30px] text-left"
        >
          <div className="flex min-h-[320px] items-center justify-center sm:min-h-[390px]">
            <img
              src={activePhoto.src}
              alt={activePhoto.alt}
              width={activePhoto.width}
              height={activePhoto.height}
              className="block h-auto max-h-[319px] w-auto max-w-full rounded-[24px] object-contain sm:max-h-[389px]"
              loading="lazy"
              decoding="async"
            />
          </div>
        </motion.div>

        <div className="flex min-h-full flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            {visibleThumbs.map(({ photo, index }) => {
              return (
                <motion.button
                  key={`${photo.src}-${index}`}
                  type="button"
                  onClick={() => handleSelect(index)}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className="relative overflow-hidden rounded-[24px] text-left"
                  aria-label={`View ${photo.alt}`}
                >
                  <div className="flex min-h-[150px] items-center justify-center sm:min-h-[180px]">
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      width={photo.width}
                      height={photo.height}
                      className="block h-auto max-h-[149px] w-auto max-w-full rounded-[18px] object-contain sm:max-h-[179px]"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
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
                aria-label="Show previous gallery photos"
                className={`inline-flex min-h-11 items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition ${
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
                aria-label="Show next gallery photos"
                className={`inline-flex min-h-11 items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition ${
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
