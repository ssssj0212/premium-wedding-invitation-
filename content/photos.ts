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
      src: "/photos/hero-1.jpg",
      alt: "Couple portrait for the wedding invitation hero"
    },
    { src: "/photos/gallery-2.jpg", alt: "Holding hands during a city walk" },
    { src: "/photos/gallery-3.jpg", alt: "Editorial close-up portrait" },
    { src: "/photos/gallery-4.jpg", alt: "Soft outdoor engagement moment" },
    { src: "/photos/gallery-5.jpg", alt: "Elegant seated portrait" },
    { src: "/photos/gallery-6.jpg", alt: "Candid laughter together" }
  ]
});

export const heroPhoto = photosContent.photos[0] ?? {
  src: "",
  alt: "Wedding hero image"
};

export const galleryPhotos = photosContent.photos;

export type PhotoItem = (typeof photosContent.photos)[number];
