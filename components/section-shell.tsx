import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type SectionShellProps = HTMLAttributes<HTMLElement> & {
  id: string;
};

export function SectionShell({ id, className, ...props }: SectionShellProps) {
  return (
    <section
      id={id}
      className={cn("section-card soft-grain px-5 py-9 sm:px-8 sm:py-11", className)}
      {...props}
    />
  );
}
