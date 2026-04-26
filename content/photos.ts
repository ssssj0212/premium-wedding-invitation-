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
    { src: "/photos/gallery-1.jpg", alt: "Standing together on the Brooklyn Bridge" },
    { src: "/photos/gallery-2.jpg", alt: "A black and white kiss beneath the bridge" },
    { src: "/photos/gallery-3.jpg", alt: "A joyful kiss on the bridge" },
    { src: "/photos/gallery-4.jpg", alt: "Holding hands on the Brooklyn Bridge" },
    { src: "/photos/gallery-5.jpg", alt: "Waving together near the bridge" },
    { src: "/photos/gallery-6.jpg", alt: "Walking together under the bridge" },
    { src: "/photos/gallery-7.jpg", alt: "Smiling together with flowers" },
    { src: "/photos/gallery-8.jpg", alt: "A wide portrait on the Brooklyn Bridge" },
    { src: "/photos/gallery-9.jpg", alt: "A playful portrait under the bridge" },
    { src: "/photos/gallery-10.jpg", alt: "A wide bridge portrait with the city skyline" },
    { src: "/photos/gallery-11.jpg", alt: "A lifted portrait on the bridge" },
    { src: "/photos/gallery-12.jpg", alt: "A carousel moment by the waterfront" },
    { src: "/photos/gallery-13.jpg", alt: "A quiet kiss on the bridge" }
  ]
});

export const heroPhoto = photosContent.photos[0] ?? {
  src: "",
  alt: "Wedding hero image"
};

export const galleryPhotos = photosContent.photos.slice(1);

export type PhotoItem = (typeof photosContent.photos)[number];
