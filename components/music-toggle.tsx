"use client";

import { siteContent } from "@/content/site";
import { Music2, Pause } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!siteContent.features.enableBackgroundMusic || !siteContent.audio.src) {
      return;
    }

    audioRef.current = new Audio(siteContent.audio.src);
    audioRef.current.loop = true;

    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  if (!siteContent.features.enableBackgroundMusic || !siteContent.audio.src) {
    return null;
  }

  const toggle = async () => {
    if (!audioRef.current) {
      return;
    }

    if (enabled) {
      audioRef.current.pause();
      setEnabled(false);
      return;
    }

    try {
      await audioRef.current.play();
      setEnabled(true);
    } catch {
      setEnabled(false);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-4 py-3 text-sm font-medium text-text shadow-lg backdrop-blur transition hover:bg-white"
    >
      {enabled ? <Pause className="h-4 w-4" /> : <Music2 className="h-4 w-4" />}
      <span>{enabled ? "Pause music" : "Play music"}</span>
    </button>
  );
}
