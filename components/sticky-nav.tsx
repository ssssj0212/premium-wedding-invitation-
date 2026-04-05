"use client";

import { motion } from "framer-motion";
import { Camera, CircleHelp, Gift, HeartHandshake, MapPinned } from "lucide-react";
import { faqContent } from "@/content/faq";
import { siteContent } from "@/content/site";
import { cn } from "@/lib/utils";

const sections = [
  { href: "#details", label: "Details", icon: MapPinned, optional: undefined },
  { href: "#gallery", label: "Gallery", icon: Camera, optional: undefined },
  { href: "#contacts", label: "Contact", icon: HeartHandshake, optional: undefined },
  { href: "#gift", label: "Gift", icon: Gift, optional: "gift" },
  { href: "#faq", label: "FAQ", icon: CircleHelp, optional: "faq" }
] as const;

export function StickyNav() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-3 z-30 mb-5 overflow-x-auto rounded-full border border-white/60 bg-[rgba(255,251,246,0.72)] px-3 py-2 shadow-[0_12px_30px_rgba(77,57,43,0.08)] backdrop-blur-xl"
      aria-label="Section navigation"
    >
      <div className="flex min-w-max items-center gap-1">
        {sections
          .filter((section) => {
            if (section.optional === "gift") {
              return siteContent.features.showGiftSection;
            }

            if (section.optional === "faq") {
              return faqContent.items.length > 0;
            }

            return true;
          })
          .map((section) => {
            const Icon = section.icon;

            return (
              <a
                key={section.href}
                href={section.href}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-3 py-2 text-[11px] font-medium tracking-[0.08em] text-muted transition duration-500 hover:bg-white/90 hover:text-text"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{section.label}</span>
              </a>
            );
          })}
      </div>
    </motion.nav>
  );
}
