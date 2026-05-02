import { z } from "zod";
import { validateContent } from "@/lib/content";

const photoItemSchema = z.object({
  src: z.string(),
  alt: z.string()
});

const photosSchema = z.object({
  photos: z.array(photoItemSchema)
});

export const photosContent = validateContent(photosSchema, {
  photos: [
    {
      src: "/photos/wedding-new/hero-english.jpg",
      alt: "Wedding invitation hero portrait"
    },
    { src: "/photos/wedding-new/gallery-1.jpg", alt: "Wedding gallery photo 1" },
    { src: "/photos/wedding-new/gallery-2.jpg", alt: "Wedding gallery photo 2" },
    { src: "/photos/wedding-new/gallery-3.jpg", alt: "Wedding gallery photo 3" },
    { src: "/photos/wedding-new/gallery-4.jpg", alt: "Wedding gallery photo 4" },
    { src: "/photos/wedding-new/gallery-5.jpg", alt: "Wedding gallery photo 5" },
    { src: "/photos/wedding-new/gallery-6.jpg", alt: "Wedding gallery photo 6" },
    { src: "/photos/wedding-new/gallery-7.jpg", alt: "Wedding gallery photo 7" },
    { src: "/photos/wedding-new/gallery-8.jpg", alt: "Wedding gallery photo 8" },
    { src: "/photos/wedding-new/gallery-9.jpg", alt: "Wedding gallery photo 9" },
    { src: "/photos/wedding-new/gallery-10.jpg", alt: "Wedding gallery photo 10" },
    { src: "/photos/wedding-new/gallery-11.jpg", alt: "Wedding gallery photo 11" },
    { src: "/photos/wedding-new/gallery-12.jpg", alt: "Wedding gallery photo 12" },
    { src: "/photos/wedding-new/gallery-13.jpg", alt: "Wedding gallery photo 13" },
    { src: "/photos/wedding-new/gallery-14.jpg", alt: "Wedding gallery photo 14" },
    { src: "/photos/wedding-new/gallery-15.jpg", alt: "Wedding gallery photo 15" },
    { src: "/photos/wedding-new/gallery-16.jpg", alt: "Wedding gallery photo 16" },
    { src: "/photos/wedding-new/gallery-17.jpg", alt: "Wedding gallery photo 17" }
  ]
});

export const heroPhoto = photosContent.photos[0] ?? {
  src: "",
  alt: "Wedding hero image"
};

export const galleryPhotos = photosContent.photos.slice(1);

export type PhotoItem = (typeof photosContent.photos)[number];
