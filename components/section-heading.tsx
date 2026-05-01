type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left"
}: SectionHeadingProps) {
  const isCenter = align === "center";
  const titleClassName = isCenter
    ? "mx-auto max-w-[30ch] font-serif text-[clamp(1.5rem,6.8vw,1.9rem)] font-medium leading-[1.14] tracking-[-0.025em] text-text sm:max-w-[32ch]"
    : "max-w-[28ch] font-serif text-[clamp(1.5rem,6.8vw,1.9rem)] font-medium leading-[1.14] tracking-[-0.025em] text-text sm:max-w-[32ch]";
  const descriptionClassName = isCenter
    ? "balanced-copy editorial-body mx-auto mt-4 max-w-full"
    : "balanced-copy editorial-body mt-4 max-w-full";

  return (
    <div className={isCenter ? "mx-auto w-full text-center" : "w-full text-left"}>
      {eyebrow ? (
        <p
          className={`ornament mb-4 inline-flex luxury-kicker text-accent ${
            isCenter ? "mx-auto" : ""
          }`}
        >
          {eyebrow}
        </p>
      ) : null}
      {title ? <h2 className={titleClassName}>{title}</h2> : null}
      {description ? (
        <p className={descriptionClassName}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
