"use client";

import Image from "next/image";
import { useState } from "react";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type ImageCardProps = {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
  fill?: boolean;
  sizes?: string;
  fallbackMode?: "default" | "minimal";
};

export function ImageCard({
  src,
  alt,
  priority,
  className,
  fill = true,
  sizes = "(max-width: 768px) 100vw, 50vw",
  fallbackMode = "default"
}: ImageCardProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    if (fallbackMode === "minimal") {
      return (
        <div
          className={cn(
            "flex h-full min-h-[240px] w-full items-end rounded-[24px] bg-[linear-gradient(180deg,#ddd2c6_0%,#c7bbb0_100%)]",
            className
          )}
        />
      );
    }

    return (
      <div
        className={cn(
          "flex h-full min-h-[240px] w-full items-center justify-center rounded-[24px] border border-dashed border-line bg-[#f6efe8] text-center text-muted",
          className
        )}
      >
        <div className="flex max-w-[200px] flex-col items-center gap-3 px-4">
          <ImageIcon className="h-8 w-8 text-accent" />
          <div>
            <p className="text-sm font-medium text-text">Replace with your photo</p>
            <p className="mt-1 text-xs leading-5 text-muted">Drop the matching file into `/public/photos`.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative h-full w-full overflow-hidden rounded-[24px] bg-[#ece1d7]", className)}>
      <Image
        src={src}
        alt={alt}
        fill={fill}
        priority={priority}
        sizes={sizes}
        className="object-cover transition duration-700 ease-out hover:scale-[1.02]"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
