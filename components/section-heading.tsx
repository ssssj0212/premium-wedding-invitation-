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
    ? "mx-auto max-w-[30ch] font-serif text-[1.28rem] leading-[1.14] tracking-[-0.03em] text-text sm:max-w-[32ch] sm:text-[1.78rem] md:text-[1.98rem] lg:max-w-none lg:text-[2.35rem] lg:whitespace-nowrap"
    : "max-w-[28ch] font-serif text-[1.28rem] leading-[1.14] tracking-[-0.03em] text-text sm:max-w-[32ch] sm:text-[1.72rem] md:max-w-none md:text-[2rem] md:whitespace-nowrap lg:text-[2.3rem]";
  const descriptionClassName = isCenter
    ? "balanced-copy editorial-body mx-auto mt-4 max-w-4xl"
    : "balanced-copy editorial-body mt-4 max-w-2xl md:max-w-4xl";

  return (
    <div className={isCenter ? "mx-auto max-w-2xl text-center" : "max-w-5xl text-left"}>
      {eyebrow ? (
        <p
          className={`ornament mb-4 inline-flex luxury-kicker text-accent ${
            isCenter ? "mx-auto" : ""
          }`}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2 className={titleClassName}>
        {title}
      </h2>
      {description ? (
        <p className={descriptionClassName}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
