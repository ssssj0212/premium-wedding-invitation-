import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type SectionShellProps = HTMLAttributes<HTMLElement> & {
  id: string;
};

export function SectionShell({ id, className, ...props }: SectionShellProps) {
  return (
    <section
      id={id}
      className={cn(
        "section-card soft-grain px-[clamp(1.15rem,5vw,2rem)] py-[clamp(2.15rem,6vw,2.75rem)]",
        className
      )}
      {...props}
    />
  );
}
