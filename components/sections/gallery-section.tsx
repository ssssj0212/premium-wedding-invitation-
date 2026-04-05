"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import { PhotoItem } from "@/content/photos";
import { ImageCard } from "@/components/image-card";
import { SectionHeading } from "@/components/section-heading";
import { SectionShell } from "@/components/section-shell";

type GallerySectionProps = {
  photos: PhotoItem[];
};

export function GallerySection({ photos }: GallerySectionProps) {
  const [active, setActive] = useState<PhotoItem | null>(null);

  return (
    <SectionShell id="gallery">
      <SectionHeading
        eyebrow="Gallery"
        title="A few frames from our season together."
        description="Replace these placeholders with your own engagement, portrait, or pre-wedding photos later."
        align="center"
      />
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {photos.map((photo, index) => (
          <button
            key={photo.src}
            type="button"
            onClick={() => setActive(photo)}
            className={index % 5 === 0 ? "col-span-2 sm:col-span-1" : ""}
          >
            <ImageCard
              src={photo.src}
              alt={photo.alt}
              className={`min-h-[180px] ${index % 5 === 0 ? "sm:min-h-[360px]" : "sm:min-h-[240px]"}`}
            />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {active ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#1b1512]/85 p-4 backdrop-blur-sm"
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.25 }}
              className="relative h-[80svh] w-full max-w-4xl"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setActive(null)}
                className="absolute right-3 top-3 z-10 inline-flex rounded-full bg-white/85 p-2 text-text"
                aria-label="Close gallery image"
              >
                <X className="h-5 w-5" />
              </button>
              <ImageCard src={active.src} alt={active.alt} className="h-full rounded-[28px]" sizes="100vw" />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </SectionShell>
  );
}
