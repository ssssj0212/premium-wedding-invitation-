import { z } from "zod";
import { validateContent } from "@/lib/content";

const photoItemSchema = z.object({
  src: z.string(),
  alt: z.string(),
  width: z.number().int().positive(),
  height: z.number().int().positive()
});

const photosSchema = z.object({
  photos: z.array(photoItemSchema)
});

export const photosContent = validateContent(photosSchema, {
  photos: [
    {
      src: "/photos/wedding-new/hero-english.jpg",
      alt: "Wedding invitation hero portrait",
      width: 4270,
      height: 6429
    },
    {
      src: "/photos/wedding-new/gallery-1.jpg",
      alt: "Wedding gallery photo 1",
      width: 4672,
      height: 7008
    },
    {
      src: "/photos/wedding-new/gallery-2.jpg",
      alt: "Wedding gallery photo 2",
      width: 6878,
      height: 4585
    },
    {
      src: "/photos/wedding-new/gallery-3.jpg",
      alt: "Wedding gallery photo 3",
      width: 4354,
      height: 6531
    },
    {
      src: "/photos/wedding-new/gallery-4.jpg",
      alt: "Wedding gallery photo 4",
      width: 6867,
      height: 4610
    },
    {
      src: "/photos/wedding-new/gallery-5.jpg",
      alt: "Wedding gallery photo 5",
      width: 4672,
      height: 7008
    },
    {
      src: "/photos/wedding-new/gallery-6.jpg",
      alt: "Wedding gallery photo 6",
      width: 4391,
      height: 6586
    },
    {
      src: "/photos/wedding-new/gallery-7.jpg",
      alt: "Wedding gallery photo 7",
      width: 6833,
      height: 4555
    },
    {
      src: "/photos/wedding-new/gallery-8.jpg",
      alt: "Wedding gallery photo 8",
      width: 4471,
      height: 6706
    },
    {
      src: "/photos/wedding-new/gallery-9.jpg",
      alt: "Wedding gallery photo 9",
      width: 6985,
      height: 4657
    },
    {
      src: "/photos/wedding-new/gallery-10.jpg",
      alt: "Wedding gallery photo 10",
      width: 4569,
      height: 6854
    },
    {
      src: "/photos/wedding-new/gallery-11.jpg",
      alt: "Wedding gallery photo 11",
      width: 4593,
      height: 6890
    },
    {
      src: "/photos/wedding-new/gallery-12.jpg",
      alt: "Wedding gallery photo 12",
      width: 4509,
      height: 6763
    },
    {
      src: "/photos/wedding-new/gallery-13.jpg",
      alt: "Wedding gallery photo 13",
      width: 4672,
      height: 7008
    },
    {
      src: "/photos/wedding-new/gallery-14.jpg",
      alt: "Wedding gallery photo 14",
      width: 4000,
      height: 6000
    },
    {
      src: "/photos/wedding-new/gallery-15.jpg",
      alt: "Wedding gallery photo 15",
      width: 6939,
      height: 4626
    },
    {
      src: "/photos/wedding-new/gallery-16.jpg",
      alt: "Wedding gallery photo 16",
      width: 4657,
      height: 6985
    },
    {
      src: "/photos/wedding-new/gallery-17.jpg",
      alt: "Wedding gallery photo 17",
      width: 4582,
      height: 6873
    }
  ]
});

export const heroPhoto = photosContent.photos[0] ?? {
  src: "",
  alt: "Wedding hero image"
};

export const galleryPhotos = photosContent.photos.slice(1);

export type PhotoItem = (typeof photosContent.photos)[number];
